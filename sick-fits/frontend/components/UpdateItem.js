// This component is responsible for sending data to
// our graph QL Yoga server. It does this via the Mutation
// component provided by Apollo (react-apollo).
// The `gql` function allows us to create a mutation that
// will be used by the Mutation component. The Apollo engineers
// also created graphql-tag. In the query that we wrote, we are
// referencing the createItem query that exists in our GraphQL
// backend. Referencing a query like this requires knowledge of
// the GraphQL schema that has been authored in our backend.
// The Mutation component takes our GraphQL mutation as a prop,
// and then exposes it to its only expected child: a render
// component. So, we wrap our entire form in this anonymous
// render component, and invoke the mutation in our onSubmit
// event handler. This function executes the mutation, awaits
// the response, and then re-routes the application. Strangely,
// the mutation function that is exposed by the Mutation component
// doesn't take any arguments; it seems to take the entire state of the component implicitely as its args.

import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`;

class UpdateItem extends Component {
    state = {};

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log('Updating item')
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
        console.log('Updated');
    }

    render() {
        return (
            <Query
                query={SINGLE_ITEM_QUERY}
                variables={{
                    id: this.props.id
                }}
            >
                {({ data, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (!data.item) return <p>No item found for ID {this.props.id}.</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                    <ErrorMessage error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="Title"
                                                required
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea
                                                id="description"
                                                name="description"
                                                placeholder="Description"
                                                required
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                placeholder="Price (cents)"
                                                required
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        );
    }

}

export default UpdateItem;
