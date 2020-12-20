import CreateItem from '../components/CreateItem';
import PleaseSignIn from '../components/PleaseSignIn';

function Sell(props) {
    return (
        <PleaseSignIn>
            <CreateItem />
        </PleaseSignIn>
    )
}

export default Sell;
