import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

export const REQUESTRESET_MUTATION = gql`
    mutation REQUESTRESET_MUTATION(
        $email: String!
    ) {
        requestReset(
            email: $email
        ) {
            message
        }
    }
`

class RequestReset extends Component {
    state = {
        email: '',
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation
                mutation={REQUESTRESET_MUTATION}
                variables={this.state}
            >
                {(reset, { error, loading, called }) => {
                    return (
                        <Form
                          method="post"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            await reset();
                            this.setState({ email: '' });
                          }}
                          data-test="RequestRest"
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Request a Password Reset</h2>
                                <ErrorMessage error={error} />
                                {!error && !loading && called && <p>Success! Check you email for a reset link</p>}
                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
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

export default RequestReset;