import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        me {
            id
            email
            name
            permissions
            orders {
                id
            }
            cart {
                id
                quantity
                item {
                    id
                    title
                    description
                    price
                    image
                }
            }
        }
    }
`;

const User = (props) => {
    return (
        <Query {...props} query={CURRENT_USER_QUERY}>
            {payload => props.children(payload)}
        </Query>
    );
}

User.propTypes = {
    children: PropTypes.func.isRequired
};

export default User;
