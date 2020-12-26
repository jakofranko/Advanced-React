import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../components/CartCount';


describe('<CartCount />', () => {
    it('renders', () =>{
        const comp = shallow(<CartCount count={10} />);
        expect(toJSON(comp)).toMatchSnapshot();
    });

    it('updates via props', () => {
        const comp = mount(<CartCount count={10} />);
        expect(toJSON(comp)).toMatchSnapshot();

        comp.setProps({ count: 50 });
        expect(toJSON(comp)).toMatchSnapshot();
    });
});
