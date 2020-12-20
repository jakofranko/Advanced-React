import ResetForm from '../components/Reset';
function Reset(props) {
    return (
        <div>
            <ResetForm resetToken={props.query.resetToken} />
        </div>
    )
}

export default Reset;
