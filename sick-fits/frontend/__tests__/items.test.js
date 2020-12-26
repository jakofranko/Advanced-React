import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponet from '../components/Item';

const fakeItem = {
    id: 'foo',
    title: 'bar',
    price: 1000,
    description: 'baz',
    image: 'unittest.jpg',
    largeImage: 'largeTest.jpg'
};

describe('<Item />', () => {

    it('should render snapshot properly', () => {
        const comp = shallow(<ItemComponet item={fakeItem} />);
        expect(toJSON(comp)).toMatchSnapshot();
    })
    it('should render properly', () => {
        const comp = shallow(<ItemComponet item={fakeItem} />);
        const priceTag = comp.find('PriceTag');
        expect(priceTag.dive().text()).toBe('$10');
        expect(comp.find('Title a').text()).toBe(fakeItem.title);
    });

    it('renders the image properly', () => {
        const comp = shallow(<ItemComponet item={fakeItem} />);
        expect(comp.find('img').props().src).toBe(fakeItem.image);
        expect(comp.find('img').props().alt).toBe(fakeItem.title);
    });

    it('renders the buttons properly', () => {
        const comp = shallow(<ItemComponet item={fakeItem} />);
        const buttonList = comp.find('.buttonList');
        expect(buttonList.children()).toHaveLength(3);
        expect(buttonList.find('Link')).toHaveLength(1);
        expect(buttonList.find('AddToCart').exists()).toBe(true);
        expect(buttonList.find('DeleteItem').exists()).toBe(true);
    });
});
