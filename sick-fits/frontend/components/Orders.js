import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';
import gql from 'graphql-tag';
import { formatDistance } from 'date-fns';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';

const ALL_ORDERS_QUERY = gql`
    query ALL_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            charge
            createdAt
            updatedAt
            user {
                id
                name
                email
            }
            items {
                id
                quantity
                price
                title
                image
            }
        }
    }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

class Orders extends Component {

    render() {
        return (
            <Query query={ALL_ORDERS_QUERY}>
                {({ data, loading, error}) => {
                    if (loading) return <p>Loading...</p>
                    const { orders } = data;
                    return (
                        <div>
                            {error && <ErrorMessage error={error} />}
                            <h2>You have made {orders.length} orders.</h2>
                            <OrderUl>
                                {orders.map(order => (
                                    <OrderItemStyles key={order.id}>
                                        <Link href={{
                                            pathname: '/order',
                                            query: {
                                                id: order.id
                                            }
                                        }}>
                                            <a>
                                                <div className="order-meta">
                                                    <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                                                    <p>{order.items.length} products</p>
                                                    <p>{formatDistance(order.createdAt, new Date())} ago</p>
                                                    <p>{formatMoney(order.total)}</p>
                                                </div>
                                                <div className="images">
                                                    {order.items.map(item => <img key={item.id} src={item.image} alt={item.title} />)}
                                                </div>
                                            </a>
                                        </Link>
                                    </OrderItemStyles>
                                ))}
                            </OrderUl>
                        </div>
                    );
                }}
            </Query>
        );
    }

}

export default Orders;
