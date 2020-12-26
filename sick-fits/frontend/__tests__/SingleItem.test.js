import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

describe('<SingleItem />', () => {
    const singleItemId = '123';

    it('renders with proper data', async () => {
        const mocks = [
            {
                request: {
                    query: SINGLE_ITEM_QUERY,
                    variables: { id: singleItemId }
                },
                result: {
                    data: {
                        item: fakeItem()
                    }
                }
            }
        ];
        const comp = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id={singleItemId} />
            </MockedProvider>
        );
        expect(comp.text()).toContain('Loading...');

        await wait();
        comp.update();
        // Snapshotting this whole component is not good
        // because it will take all of the apollo scafolding
        // with it. Only snapshot the important bits.
        expect(toJSON(comp.find('h2'))).toMatchSnapshot();
        expect(toJSON(comp.find('img'))).toMatchSnapshot();
        expect(toJSON(comp.find('p'))).toMatchSnapshot();
    });

    it('errors with a not found item', async () => {
        const mocks = [
            {
                request: {
                    query: SINGLE_ITEM_QUERY,
                    variables: { id: singleItemId }
                },
                result: {
                    errors: [{ message: 'Items not found!' }]
                }
            }
        ];
        const comp = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id={singleItemId} />
            </MockedProvider>
        );

        await wait();
        comp.update();

        const item = comp.find('[data-test="graphql-error"]')
        expect(toJSON(item)).toMatchSnapshot();
    })
});
