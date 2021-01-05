import CreateItem from '../components/CreateItem';
import PleaseSignIn from '../components/PleaseSignIn';

function Sell(props) {
    return (
        <PleaseSignIn allowedPermissions={['ADMIN', 'ITEMCREATE']}>
            <CreateItem />
        </PleaseSignIn>
    )
}

export default Sell;
