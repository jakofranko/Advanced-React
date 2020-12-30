import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveCartItem';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

global.alert = console.log;

const cartItemId = 'unittestcartitemid';
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: cartItemId, price: 5000 })]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: cartItemId }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: cartItemId
        }
      }
    }
  }
];

describe('<RemoveFromCart />', () => {
  it('should render and match snapshot', () => {
    const comp = mount(
      <MockedProvider>
        <RemoveFromCart id={cartItemId} />
      </MockedProvider>
    );

    expect(toJSON(comp.find('button'))).toMatchSnapshot();
  });

  it('should remove the item from the cart', async () => {
    let apolloClient;
    const comp = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart id={cartItemId} />
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    const { data: { me } } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me.cart).toHaveLength(1);
    expect(me.cart[0].item.price).toBe(5000);

    // remove item
    comp.find('button').simulate('click');
    await wait();

    const { data: { me: me2 } } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me2.cart).toHaveLength(0);    
  });
});
