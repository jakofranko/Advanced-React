import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import RequestReset, { REQUESTRESET_MUTATION } from '../components/RequestReset';
import { MockedProvider } from 'react-apollo/test-utils';

const mocks = [{
  request: {
    query: REQUESTRESET_MUTATION,
    variables: { email: 'unit@test.com' }
  },
  result: {
    data: {
      requestReset: {
        message: 'success',
        __typename: 'Message'
      }
    }
  }
}];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', async () => {
    const comp = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const form = comp.find('[data-test="RequestRest"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const comp = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    comp
      .find('input')
      .simulate(
        'change',
        {
          target: {
            name: 'email',
            value: 'unit@test.com'
          }
        }
      );
    comp.find('form').simulate('submit');

    await wait();
    comp.update();

    expect(comp.find('p').text()).toContain('Success! Check you email for a reset link');
  });
});
