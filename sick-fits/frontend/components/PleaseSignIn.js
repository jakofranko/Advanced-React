import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

class PleaseSignIn extends Component {
    static propTypes = {
        allowedPermissions: PropTypes.arrayOf(PropTypes.string)
    }
    static defaultProps = {
        allowedPermissions: []
    }
    render() {
        const { allowedPermissions } = this.props;
        
        return (
            <Query
                query={CURRENT_USER_QUERY}
            >
                {({ data }, loading) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.me) {
                        return (
                            <div>
                                <p>Please sign in to view this page.</p>
                                <Signin />
                            </div>
                        );
                    }
                    if (allowedPermissions.length && !allowedPermissions.some(p => data.me.permissions.includes(p))) {
                        return <p>You do not have permission to view this page.</p>
                    }

                    return this.props.children;
                }}
            </Query>
        );
    }

}

export default PleaseSignIn;
