import UpdateItem from '../components/UpdateItem';
import PleaseSignIn from '../components/PleaseSignIn';

function UpdateItemPage({ query }) {
    return (
        <PleaseSignIn allowedPermissions={['ADMIN', 'ITEMUPDATE']}>
            <UpdateItem id={query.id} />
        </PleaseSignIn>
    )
}

export default UpdateItemPage;
