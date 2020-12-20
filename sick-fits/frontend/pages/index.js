import Items from '../components/Items';

function Home(props) {
    const { query } = props;
    const page = query.page ? parseFloat(query.page) : 1;
    return (
        <div>
            <Items page={page} />
        </div>
    )
}

export default Home;
