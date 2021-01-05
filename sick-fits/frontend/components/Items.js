import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';
import User from './User';
import ErrorMessage from './ErrorMessage';
import Pagination from '../components/Pagination';
import { perPage } from '../config';

export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    items: ({ page, render }) => (
        <Query
            query={ALL_ITEMS_QUERY}
            variables={{ skip: page * perPage - perPage }}
        >
            {render}
        </Query>
    )
});

const Center = styled.div`
    text-align: center;
`;

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

export default class Items extends Component {
    render() {
        return (
            <Center>
                <Composed page={this.props.page} >
                    {({ user, items }) => {
                        const { data: itemsData } = items;
                        const { data: { me = {} } } = user;
                        const { permissions } = me;

                        if (user.loading || items.loading) return <p>Loading...</p>;
                        if (user.error) return <ErrorMessage error={user.error} />;
                        if (items.error) return <ErrorMessage error={items.error} />;

                        return (
                            <div>
                                <Pagination page={this.props.page} />
                                <p>I found {itemsData.items.length} items</p>
                                <ItemsList>
                                    {itemsData.items.map(item => (
                                        <Item
                                            userPermissions={permissions}
                                            item={item}
                                            key={item.id}
                                        />
                                    ))}
                                </ItemsList>
                                <Pagination page={this.props.page} />
                            </div>
                        );
                    }}
                </Composed>
            </Center>
        );
    }
}
