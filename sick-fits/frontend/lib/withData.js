// This creates an HOC that provides not only normal
// apollo operations, but also tells Apollo where our
// GraphQL Yoga server is going to be running. This HOC
// is used in the _app.js component.
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // local state
    clientState: {
        resolvers: {
            Mutation: {
                toggleCart(_, variables, { cache }) {
                    // Read current cache
                    const { cartOpen } = cache.readQuery({
                        query: LOCAL_STATE_QUERY
                    });
                    const data = {
                        data: {
                            cartOpen: !cartOpen
                        }
                    };

                    cache.writeData(data);
                    return data;
                }
            }
        },
        defaults: {
            cartOpen: false
        }
    }
  });
}

export default withApollo(createClient);
