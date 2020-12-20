import Link from 'next/link'
import UpdateItem from '../components/UpdateItem';

function Sell({ query }) {
    return (
        <div>
            <p>Sell an Item</p>
            <UpdateItem id={query.id} />
        </div>
    )
}

export default Sell;
