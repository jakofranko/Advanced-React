import PleaseSignIn from '../components/PleaseSignIn';
import PermissionsControl from '../components/Permissions';

function Permissions(props) {
    return (
        <PleaseSignIn allowedPermissions={['ADMIN', 'PERMISSIONUPDATE']}>
            <PermissionsControl />
        </PleaseSignIn>
    )
}

export default Permissions;
