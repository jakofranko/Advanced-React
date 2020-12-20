import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

export const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

export const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION(
        $userId: ID!
        $permissions: [Permission]
    ) {
        updatePermissions(
            userId: $userId
            permissions: $permissions
        ) {
            id
            permissions
            name
            email
        }
    }
`;

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

class Permissions extends Component {

    render() {
        return (
            <Query query={ALL_USERS_QUERY}>
                {({ data: { users }, loading, error }) => {
                    if (loading) return <p>Loading...</p>
                    return (
                        <div>
                            <ErrorMessage error={error} />
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        {possiblePermissions.map(p => <th key={p}>{p}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.map(u => <UserRow key={u.id} user={u} />)}
                                </tbody>
                            </Table>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

class UserRow extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired
    }
    state = {
        permissions: this.props.user.permissions, // Normally a no-no, but we are simply seeding state
    }
    handlePermissionChange = (e) => {
        const { target: { value, checked } } = e;
        const updatedPermissions = [...this.state.permissions];

        if (checked) updatedPermissions.push(value);
        else updatedPermissions.splice(updatedPermissions.indexOf(value), 1);

        this.setState({ permissions: updatedPermissions });
    }
    render() {
        const { user } = this.props;
        const { permissions } = this.state;
        return (
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions,
                    userId: user.id
                }}
            >
                {(updatePermissions, { loading, error }) => {
                    return (
                        <tr>
                            {error && (
                                <td colSpan={2}>
                                    <ErrorMessage error={error} />
                                </td>
                            )}
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermissions.map(p => (
                                <td key={`${user.id}-${p}`}>
                                    <label htmlFor={`${user.id}-permission-${p}`}>
                                        <input
                                            id={`${user.id}-permission-${p}`}
                                            type="checkbox"
                                            checked={permissions.includes(p)}
                                            value={p}
                                            onChange={this.handlePermissionChange}
                                        />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    onClick={() => updatePermissions()}
                                    disabled={loading}
                                >
                                    Updat{loading ? 'ing' : 'e'}
                                </SickButton>
                            </td>
                        </tr>
                    );
                }}
            </Mutation>
        );
    }
}

export default Permissions;
