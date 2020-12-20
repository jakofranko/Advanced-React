import Items from '../components/Items';
import SingleItem from '../components/SingleItem';

function Item({ query }) {
    return (
        <div>
            <p>Single item!</p>
            <SingleItem id={query.id}/>
        </div>
    )
}

export default Item;
