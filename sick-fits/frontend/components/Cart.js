import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem';
import TakeMyMoney from './TakeMyMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

export const LOCAL_STATE_QUERY = gql`
    query LOCAL_STATE_QUERY {
        cartOpen @client
    }
`;

export const TOGGLE_CART_MUTATION = gql`
    mutation TOGGLE_CART_MUTATION {
        toggleCart @client
    }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

class Cart extends Component {
    render() {
        return (
            <Composed>
                {({ user, toggleCart, localState}) => {
                    const { me } = user.data;
                    const { cartOpen } = localState.data;
                    if (!me) return null;
                    return (
                        <CartStyles open={cartOpen}>
                            <header>
                                <CloseButton onClick={toggleCart}>&times;</CloseButton>
                                <Supreme>{me.name}'s Cart</Supreme>
                                <p>You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart.</p>
                            </header>
                            <ul>
                                {me.cart.map(cartItem => (
                                    <CartItem cartItem={cartItem} key={cartItem.id} />
                                ))}
                            </ul>
                            <footer>
                                <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                                {me.cart.length && <TakeMyMoney>
                                    <SickButton>Checkout</SickButton>
                                </TakeMyMoney>}
                            </footer>
                        </CartStyles>
                    );
                }}
            </Composed>
        );
    }

}

export default Cart;
