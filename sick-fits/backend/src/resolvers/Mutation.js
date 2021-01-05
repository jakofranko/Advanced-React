const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const tokenCookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
};

const Mutations = {
    async createItem(parent, args, ctx, info) {
        const { userId, user } = ctx.request;

        if (!userId) {
            throw new Error('You need to be logged in to do that!');
        }

        hasPermission(currentUser, ['ADMIN', 'ITEMCREATE']);

        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        const { userId, user } = ctx.request;

        if (!userId) {
            throw new Error('You need to be logged in to do that!');
        }

        hasPermission(currentUser, ['ADMIN', 'ITEMUPDATE']);

        // First, take acopy of the updates
        const updates = { ...args };
        // Remove ID
        delete updates.id;
        // Run the update
        return ctx.db.mutation.updateItem({ // db.mutation is populated by the prisma.graphql
            data: updates,
            where: {
                id: args.id
            }
        }, info); // Passing in `info` tells the mutation what to return.
    },
    async deleteItem(parent, args, ctx, info) {
        const { userId, user } = ctx.request;

        if (!userId) {
            throw new Error('You need to be logged in to do that!');
        }

        hasPermission(currentUser, ['ADMIN', 'ITEMDELETE']);

        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions = ctx.request.user.permissions.some(p => ['ADMIN', 'ITEMDELETE'].includes(p));

        if (!ownsItem && !hasPermissions) {
            throw new Error('You don\'t have permission to delete that item!');
        }

        return ctx.db.mutation.deleteItem({ where }, info)
    },
    async signup(parent, args, ctx, info) {
        const email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                email,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);

        // Create the JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // Set cookie on response
        ctx.response.cookie('token', token, tokenCookieOptions);

        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        // 1. Check for user
        const user = await ctx.db.query.user({ where: { email }});

        // 2. validate password
        const valid = await bcrypt.compare(password, user.password);
        if (!user || !valid) {
            throw new Error('Invalid password or user');
        }

        // 3. generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // 4. set cooking with token
        ctx.response.cookie('token', token, tokenCookieOptions);
        // 5. return user
        return user;
    },
    signout(parent, args, ctx, info) {
        // Invalidate the token cookie
        ctx.response.clearCookie('token', tokenCookieOptions);
        return { message: 'Signed out' };
    },
    async requestReset(parent, { email }, ctx, info) {
        // 1. Check if real user
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        // 2. set a reset token and expiry for that user
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + (1000 * 60 * 60); // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // 3. email them that reset token
        const mailRes = await transport.sendMail({
            from: 'jake@example.com',
            to: user.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail(`Your password reset token is here!

            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset your password</a>`)
        });

        return { message: 'Email sent!' };
    },
    async resetPassword(parent, { password, confirmPassword, resetToken }, ctx, info) {
        // 1. check if the passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        // 2. check reset token
        // 3. check expiry
        const [user] = await ctx.db.query.users({
            where: {
                resetToken,
                resetTokenExpiry_gte: Date.now() - (1000 * 60 * 60),
            }
        }, info);
        if (!user) {
            throw new Error('This token is either invalid or expired!');
        }
        // 4. hash new password
        const newPassword = await bcrypt.hash(password, 10);
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password: newPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        }, info);

        // Generate JWT
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, tokenCookieOptions);

        return updatedUser;
    },
    async updatePermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in');
        }

        const currentUser = await ctx.db.query.user({
            where: {
                id: ctx.request.userId
            }
        }, info);

        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            }
        }, info);
    },
    async addToCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        // 1. check that they are signed in
        if (!userId) {
            throw new Error('You must be signed in');
        }
        // 2. query the user's current cart
        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id },
            }
        }, info);
        // 3. check if that item already in their cart. If so,
        // increment the item.
        if (existingCartItem) {
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            }, info)
        }
        // 4. else add new item
        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info);
    },
    async removeFromCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('You must be logged in!');
        }

        const { id: cartItemId } = args;
        const [cartItem] = await ctx.db.query.cartItems({
            where: {
                id: cartItemId
            }
        }, `{ id user { id }}`);

        if (!cartItem) {
            throw new Error('That cart item doesn\'t exist!');
        }

        if (userId !== cartItem.user.id) {
            throw new Error('You do not have permission to remove that cart item');
        }

        return ctx.db.mutation.deleteCartItem({
            where: { id: cartItemId }
        }, info);
    },
    async createOrder(parent, args, ctx, info) {
        // 1. query current user (make sure sigened in)
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('You must be signed in to complete your purchase!')
        }

        const user = await ctx.db.query.user({ where: { id: userId } }, `
            {
                id
                name
                email
                cart {
                    id
                    quantity
                    item {
                        title
                        price
                        id
                        description
                        image
                        largeImage
                    }
                }
            }`
        );

        // 2. Recalculate the total for the price
        const amount = user.cart.reduce(
            (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0
        );
        console.log(`Going to charge ${amount}`)
        // 3. create the stripe charge (turn token into $$$)
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token
        })
        // 4. convert the cart items to order items
        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: { connect: { id: userId } }, // create relationship to user object
            };
            delete orderItem.id; // We want to create new order items, and should not pass in an ID. Prisma will do this automatically
            return orderItem;
        });
        // 5. create the order
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                // Our order schema defines items as an array of
                // OrderItem; passing in { create: orderItems }
                // tells graphql to create all of the entries
                // in the type defined in the schema, and then
                // associate them with this order.
                // Such cool! Much Wow!
                items: { create: orderItems },
                user: { connect: { id: userId } },
            }
        });
        // 6. clean up - clear the users cart, delete cartItems
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds
            },
        });
        // 7. Return the order to the client
        return order;
    }
};

module.exports = Mutations;
