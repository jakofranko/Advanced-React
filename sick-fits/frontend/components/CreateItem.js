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
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    }

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    uploadFile = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/dxfk2fjmp/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form data-test="CreateItem" onSubmit={async (e) => {
                        e.preventDefault();
                        // Send state to mutation
                        const res = await createItem();
                        const { data: {
                            createItem: { id } } } = res;
                        // Go to the new item page
                        Router.push({
                            pathname: '/item',
                            query: { id }
                        });
                    }}>
                        <ErrorMessage error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Image
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    placeholder="Upload an image"
                                    required
                                    onChange={this.uploadFile}
                                />
                                {this.state.image && <img src={this.state.image} alt={this.state.title} />}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    required
                                    value={this.state.title}
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
                                    value={this.state.description}
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
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }

}

export default CreateItem;
