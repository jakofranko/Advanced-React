import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Nav from '../components/Nav';
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

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
    const comp = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    comp.update();

    // The data-test prop allows us to drill down
    // quickly past all of the apollo boiler-plate
    // to get to the component we really want to test.
    const nav = comp.find('[data-test="Nav"]');
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders a full nav when signed in', async () => {
    const comp = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    comp.update();

    // The data-test prop allows us to drill down
    // quickly past all of the apollo boiler-plate
    // to get to the component we really want to test.
    const nav = comp.find('ul[data-test="Nav"]');
    // The snapshots are way too big due to the mutation
    // component in the signout button. Be more specific.
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(nav.children().length).toBe(6);
    // Could write out full expected nav. Imo,
    // this is fairly mutable, and so I won't
    // touch for now
    expect(nav.text()).toContain('Sign Out');
  });
});
