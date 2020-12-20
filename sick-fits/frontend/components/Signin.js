import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

export const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION(
        $email: String!
        $password: String!
    ) {
        signin(
            email: $email
            password: $password
        ) {
            id
            email
        }
    }
`

class Signin extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { error, loading }) => {
                    return (
                        <Form method="post" onSubmit={async (e) => {
                            e.preventDefault();
                            await signup();
                            this.setState({ name: '', email: '', password: '' });
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign In</h2>
                                <ErrorMessage error={error} />
                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} />
                                </label>
                                <button type="submit">Sign In!</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }

}

export default Signin;
