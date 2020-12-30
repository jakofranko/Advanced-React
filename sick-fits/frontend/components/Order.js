import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

export const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

class Order extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    render() {
        return (
            <Query
                query={SINGLE_ORDER_QUERY}
                variables={{
                    id: this.props.id
                }}
            >
                {({ data, error, loading }) => {
                    if (error) return <ErrorMessage error={error} />;
                    if (loading) return <p>Loading...</p>;

                    const { order } = data;
                    return (
                        <OrderStyles data-test="Order">
                            <Head>
                                <title>Sick Fits - Order {this.props.id}</title>
                            </Head>
                            <p>
                                <span>Order ID:</span>
                                <span>{this.props.id}</span>
                            </p>
                            <p>
                                <span>Charge</span>
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date</span>
                                <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                            </p>
                            <p>
                                <span>Total</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Item Count</span>
                                <span>{order.items.length}</span>
                            </p>
                            <div className="items">
                                {order.items.map(orderItem => {
                                    return (
                                        <div key={orderItem.id} className="order-item">
                                            <img src={orderItem.image} alt={orderItem.title} />
                                            <div className="item-details">
                                                <h2>{orderItem.title}</h2>
                                                <p>Qty: {orderItem.quantity}</p>
                                                <p>Each: {formatMoney(orderItem.price)}</p>
                                                <p>SubTotal: {formatMoney(orderItem.price * orderItem.quantity)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </OrderStyles>
                    );
                }}
            </Query>
        );
    }

}

export default Order;
