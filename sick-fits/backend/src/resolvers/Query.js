const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // Check if there is a current user ID
        if (!ctx.request.userId) {
            return null;
        }

        return ctx.db.query.user({
            where: {
                id: ctx.request.userId,
            }
        }, info);
    },
    users(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }
        // 1. Check if logged in user has perms to query all users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']); // throws if not
        // 2. If so, return all users
        return ctx.db.query.users({}, info);
    },
    async order(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to view an order!');
        }

        const order = await ctx.db.query.order({
            where: {
                id: args.id
            }
        }, info);

        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermission = ctx.request.user.permissions.includes('ADMIN');
        console.log(order, ctx.request.user)

        if (!ownsOrder && !hasPermission) {
            throw new Error('Unauthorized');
        }

        return order;
    },
    orders(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to view orders!');
        }

        return ctx.db.query.orders({
            where: {
                user: {
                    id: ctx.request.userId
                }
            }
        }, info);
    },
};

module.exports = Query;
