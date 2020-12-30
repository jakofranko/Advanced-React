import { mount } from 'enzyme';
import wait from 'waait';
import PleaseSignIn from '../components/PleaseSignIn';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: null } }
}];
const signedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: fakeUser() } }
}];

describe('<PleaseSignIn />', () => {
  it('renders the sign-in dialog to logged out users', async () => {
    const comp = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    // Wait for the mocked response to return,
    // then update the component.
    await wait();
    comp.update();

    expect(comp.text()).toContain('Please sign in to view this page');

    const Signin = comp.find('Signin');
    expect(Signin.exists()).toBe(true);
  });

  it('renders the child component to logged in users', async () => {
    const TestChild = () => <p>Hey!</p>;
    const comp = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <TestChild />
        </PleaseSignIn>
      </MockedProvider>
    );

    // Wait for the mocked response to return,
    // then update the component.
    await wait();
    comp.update();

    const testComp = comp.find('TestChild');
    expect(testComp.exists()).toBe(true);
  });
});
