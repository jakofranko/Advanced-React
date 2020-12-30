import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeOrder } from '../lib/testUtils';

const orderId = 'unittestorderid';
const mocks = [{
    request: {
        query: SINGLE_ORDER_QUERY,
        variables: { id: orderId }
    },
    result: {
        data: {
            order: fakeOrder()
        }
    }
}];

describe('<Order />', () => {
    it('renders and matches snapshot', async () => {
        const comp = mount(
            <MockedProvider mocks={mocks}>
                <Order id={orderId} />
            </MockedProvider>
        );

        await wait();
        comp.update();

        expect(toJSON(comp.find('[data-test="Order"]'))).toMatchSnapshot();
    });
});
