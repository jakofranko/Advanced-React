import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = ({ query }) => (
    <PleaseSignIn>
        <Order id={query.id} />
    </PleaseSignIn>
);

export default OrderPage;
