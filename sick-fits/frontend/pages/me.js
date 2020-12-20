import User from '../components/User';

const Me = () => (
    <User>
        {({ data: { me }}) => (
            <div>it's me, {me.name}</div>
        )}
    </User>
);

export default Me;
