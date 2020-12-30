import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

jest.mock('next/router');
jest.mock('nprogress');

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me: { ...fakeUser(), cart: [fakeCartItem()] } }
    }
  }
];

describe('<TakeMyMoney />', () => {
  it('should render and match snapshot', async () => {
    const comp = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );

    await wait();
    comp.update();

    expect(toJSON(comp.find('ReactStripeCheckout'))).toMatchSnapshot();
  });

  it('creates an order token', async () => {
      const createOrderMock = jest.fn().mockResolvedValue({
          data: { createOrder: { id: 'abc123' } }
      });
      const comp = mount(
        <MockedProvider mocks={mocks}>
          <TakeMyMoney />
        </MockedProvider>
      );

      const instance = comp.find('TakeMyMoney').instance();

      // Manually call onToken method
      instance.onToken({ id: 'something' }, createOrderMock);

      expect(createOrderMock).toHaveBeenCalledWith({"variables": {"token": "something"}});
  });

  it('turns the progress bar on', async () => {
      const createOrderMock = jest.fn().mockResolvedValue({
          data: { createOrder: { id: 'abc123' } }
      });
      const comp = mount(
        <MockedProvider mocks={mocks}>
          <TakeMyMoney />
        </MockedProvider>
      );

      const instance = comp.find('TakeMyMoney').instance();

      // Manually call onToken method
      instance.onToken({ id: 'something' }, createOrderMock);

      expect(NProgress.start).toHaveBeenCalled();
  });

  it('routes to the correct page', async () => {
      const createOrderMock = jest.fn().mockResolvedValue({
          data: { createOrder: { id: 'abc123' } }
      });
      const comp = mount(
        <MockedProvider mocks={mocks}>
          <TakeMyMoney />
        </MockedProvider>
      );

      const instance = comp.find('TakeMyMoney').instance();

      // Manually call onToken method
      instance.onToken({ id: 'something' }, createOrderMock);

      expect(Router.push).toHaveBeenCalledWith({"pathname": "/order", "query": {"id": "abc123"}});
  });
});
