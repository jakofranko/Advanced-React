import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

function totalItems(cart) {
    return cart.reduce((tally, item) => tally + item.quantity, 0);
}

class TakeMyMoney extends Component {
    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => alert(err));

        Router.push({
            pathname: '/order',
            query: { id: order.data.createOrder.id },
        });
    }
    render() {
        return (
            <User>
                {({ data: { me }}) => (
                    <Mutation
                        mutation={CREATE_ORDER_MUTATION}
                        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                    >
                        {(createOrder) => (
                            <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                name="Sick Fits"
                                description={`Order of ${totalItems(me.cart)}`}
                                image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                stripeKey="pk_test_51I0JzZLQxdlXqFsox16igh7iIUNrylNUKSdJfvqdfadRrNZeg7tmMqzhwH7CaosI4JNrGYme5hK1KrTHsHsxzpGf00D5eJT2eC"
                                currency="USD"
                                email={me.email}
                                token={res => this.onToken(res, createOrder)}
                            >
                                {this.props.children}
                            </StripeCheckout>
                        )}
                    </Mutation>
                )}
            </User>
        );
    }

}

export default TakeMyMoney;
