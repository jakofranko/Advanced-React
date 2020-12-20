import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User, { CURRENT_USER_QUERY } from './User';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';

export const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        signout {
            message
        }
    }
`;

export default function Nav() {
    return (
        <User>
            {({ data: { me } }) => (
                <NavStyles>
                    <Link href="/items">
                        <a>Shop</a>
                    </Link>
                    {me && (
                        <>
                            <Link href="/sell">
                                <a>Sell</a>
                            </Link>
                            <Link href="/orders">
                                <a>Orders</a>
                            </Link>
                            <Link href="/me">
                                <a>Account</a>
                            </Link>
                            <Mutation mutation={TOGGLE_CART_MUTATION}>
                                {(toggleCart) =>(
                                    <button onClick={toggleCart}>
                                        My Cart
                                        <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)} />
                                    </button>
                                )}
                            </Mutation>
                            <Mutation
                                mutation={SIGNOUT_MUTATION}
                                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                            >
                                {(signout) => (
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await signout();
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                )}
                            </Mutation>
                        </>
                    )}
                    {!me && (
                        <Link href="/signup">
                            <a>Sign In</a>
                        </Link>
                    )}
                </NavStyles>
            )}
        </User>
    );
}
