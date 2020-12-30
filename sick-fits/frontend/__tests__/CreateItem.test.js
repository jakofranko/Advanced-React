import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

jest.mock('next/router')

const dogImage = 'https://www.dog.com/dog.jpg';
// Mock global fetch
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }]
  })
});

describe('<CreateItem />', () => {
  it('renders and matches snapshot', () => {
    const comp = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const form = comp.find('[data-test="CreateItem"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('renders and matches snapshot', async () => {
    const comp = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const input = comp.find('input[type="file"]');
    input.simulate('change', {
      target: {
        files: ['fakedog.jpg']
      }
    });

    await wait();
    comp.update();

    const instance = comp.find('CreateItem').instance();
    expect(instance.state.image).toBe(dogImage);
    expect(instance.state.largeImage).toBe(dogImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset(); // wrong
  });

  it('handles state updating', async () => {
    const comp = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const title = 'unit test title';
    const description = 'unit test description';
    const price = 999;

    comp.find('#title').simulate('change', {
      target: {
        name: 'title',
        value: title
      }
    });
    comp.find('#description').simulate('change', {
      target: {
        name: 'description',
        value: description
      }
    });
    comp.find('#price').simulate('change', {
      target: {
        name: 'price',
        value: price
      }
    });

    expect(comp.find('CreateItem').instance().state).toMatchObject({
      title,
      description,
      price
    });
  });

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [{
      request: {
        query: CREATE_ITEM_MUTATION,
        variables: {
          title: item.title,
          description: item.description,
          price: item.price,
          image: '',
          largeImage: ''
        }
      },
      result: {
        data: {
          createItem: {
            ...fakeItem,
            id: 'abc123',
            __typename: 'Item'
          }
        }
      }
    }];

    const comp = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );

    comp.find('#title').simulate('change', {
      target: {
        name: 'title',
        value: item.title
      }
    });
    comp.find('#description').simulate('change', {
      target: {
        name: 'description',
        value: item.description
      }
    });
    comp.find('#price').simulate('change', {
      target: {
        name: 'price',
        value: item.price
      }
    });

    comp.find('form').simulate('submit');
    await wait(50);

    expect(Router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: 'abc123' }
    });
  });
});
