import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

export const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $resetToken: String!
        $password: String!
        $confirmPassword: String!
    ) {
        resetPassword(
            resetToken: $resetToken
            password: $password
            confirmPassword: $confirmPassword
        ) {
            id
            email
            name
        }
    }
`

class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }
    state = {
        password: '',
        confirmPassword: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation
                mutation={RESET_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(reset, { error, loading, called }) => {
                    return (
                        <Form method="post" onSubmit={async (e) => {
                            e.preventDefault();
                            await reset();
                            this.setState({ password: '', confirmPassword: '' });
                            setTimeout(() => Router.push("/"), 1000);
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Reset Your Password</h2>
                                <ErrorMessage error={error} />
                                {!error && !loading && called && <p>Success! You have been signed in.</p>}
                                <label htmlFor="email">
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="email">
                                    Confirm Password
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={this.state.confirmPassword}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Reset Password</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }

}

export default Reset;
