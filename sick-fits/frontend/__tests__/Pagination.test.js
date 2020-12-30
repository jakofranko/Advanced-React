import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
  push() {},
  prefetch() {}
};

function makeMocksFor(length) {
  return [{
    request: { query: PAGINATION_QUERY },
    result: {
      data: {
        itemsConnection: {
          __typename: 'aggregate',
          aggregate: {
            __typename: 'count',
            count: length
          }
        }
      }
    }
  }];
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const comp = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(comp.text()).toContain("Loading Pagination...");
  });

  it('renders the pagination component', async () => {
    const comp = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    comp.update();

    const pagination = comp.find('[data-test="Pagination"]');
    expect(pagination.find('.totalPages').text()).toBe('5');
    expect(toJSON(pagination)).toMatchSnapshot();
  });

  it('disables the next button on the first page', async () => {
    const comp = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await wait();
    comp.update();

    expect(comp.find('a.prev').prop('aria-disabled')).toBe(true);
    expect(comp.find('a.next').prop('aria-disabled')).toBe(false);
  });

  it('disables the prev button on the last page', async () => {
    const comp = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );

    await wait();
    comp.update();

    expect(comp.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(comp.find('a.next').prop('aria-disabled')).toBe(true);
  });

  it('enables both buttons on the middle page', async () => {
    const comp = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    await wait();
    comp.update();

    expect(comp.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(comp.find('a.next').prop('aria-disabled')).toBe(false);
  });
});
