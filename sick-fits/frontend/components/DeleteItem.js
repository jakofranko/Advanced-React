import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

export const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

class DeleteItem extends Component {
    update = (cache, payload) => {
        // manually update cache so it matches server
        // 1. find the items we want in the cache
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
        // 2. filter the deleted item out of the cache
        data.items = data.items.filter(i => i.id !== payload.data.deleteItem.id);
        // 3. put items back
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data });

    }
    render() {
        return (
            <Mutation
                mutation={DELETE_ITEM_MUTATION}
                variables={{ id: this.props.id }}
                update={this.update}
            >
                {(deleteItem, { error }) => (
                    <button onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                            deleteItem()
                                .catch(err => alert(err));
                        }
                    }}>
                        Delete item
                    </button>
                )}
            </Mutation>
        );
    }

}

export default DeleteItem;
