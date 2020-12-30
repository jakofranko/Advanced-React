import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

function type(comp, name, value) {
  comp
    .find(`input[name="${name}"]`)
    .simulate('change', {
      target: { name, value }
    });
}

const me = fakeUser();
const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: 'unittests'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me }
    }
  }
];

describe('<Signup />', () => {
  it('renders and matches snapshot', () => {
    const comp = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );

    expect(toJSON(comp.find('form'))).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    let apolloClient;
    const comp = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    comp.update();

    type(comp, 'name', me.name);
    type(comp, 'email', me.email);
    type(comp, 'password', 'unittests');

    comp.update();
    comp.find('form').simulate('submit');

    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
