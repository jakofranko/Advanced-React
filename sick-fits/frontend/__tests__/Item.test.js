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

    describe('renders the buttons properly', () => {
        it('should only render add to cart if no user is present', () => {
            const comp = shallow(<ItemComponet item={fakeItem} />);
            const buttonList = comp.find('.buttonList');
            expect(buttonList.children()).toHaveLength(1);
            expect(buttonList.find('AddToCart').exists()).toBe(true);
        });

        it('should only render the delete button if has perms', () => {
            const comp = shallow(<ItemComponet userPermissions={['ITEMDELETE']} item={fakeItem} />);
            const buttonList = comp.find('.buttonList');
            expect(buttonList.children()).toHaveLength(2);
            expect(buttonList.find('AddToCart').exists()).toBe(true);
            expect(buttonList.find('DeleteItem').exists()).toBe(true);
        });

        it('should only render the edit buttin if has perms', () => {
            const comp = shallow(<ItemComponet userPermissions={['ITEMUPDATE']} item={fakeItem} />);
            const buttonList = comp.find('.buttonList');
            expect(buttonList.children()).toHaveLength(2);
            expect(buttonList.find('Link')).toHaveLength(1);
            expect(buttonList.find('Link a').text()).toContain('Edit');
            expect(buttonList.find('AddToCart').exists()).toBe(true);
        });

        it('should render all buttons if admin', () => {
            const comp = shallow(<ItemComponet userPermissions={['ADMIN']} item={fakeItem} />);
            const buttonList = comp.find('.buttonList');
            expect(buttonList.children()).toHaveLength(3);
            expect(buttonList.find('Link')).toHaveLength(1);
            expect(buttonList.find('AddToCart').exists()).toBe(true);
            expect(buttonList.find('DeleteItem').exists()).toBe(true);
        });
    });
});
