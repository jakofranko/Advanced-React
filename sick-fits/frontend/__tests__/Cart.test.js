import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  },
  {
    request: {
      query: LOCAL_STATE_QUERY
    },
    result: {
      data: {
        cartOpen: true
      }
    }
  }
];

describe('<Cart />', () => {
  it('renders and matches snapshot', async () => {
    const comp = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );

    await wait();
    comp.update();

    expect(toJSON(comp.find('header'))).toMatchSnapshot();
    expect(comp.find('CartItem')).toHaveLength(1);
  });
});
