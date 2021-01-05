import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import AddToCart from './AddToCart';
import DeleteItem from './DeleteItem';
import formatMoney from '../lib/formatMoney';

const canUpdatePerms = ['ADMIN', 'ITEMUPDATE'];
const canDeletePerms = ['ADMIN', 'ITEMDELETE'];

export default class Item extends Component {
    static propTypes = {
        item: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isReqruied,
        }),
        userPermissions: PropTypes.arrayOf(PropTypes.string)
    }
    static defaultProps = {
        userPermissions: []
    }
    render() {
        const { item, userPermissions } = this.props;
        const canUpdate = canUpdatePerms.some(p => userPermissions.includes(p));
        const canDelete = canDeletePerms.some(p => userPermissions.includes(p));

        return (
            <ItemStyles>
                {item.image && <img src={item.image} alt={item.title}/>}

                <Title>
                    <Link href={{
                        pathname: '/item',
                        query: { id: item.id }
                    }}>
                        <a>{item.title}</a>
                    </Link>
                </Title>
                <PriceTag>{formatMoney(item.price)}</PriceTag>
                <p>{item.description}</p>
                <div className="buttonList">
                    {canUpdate && (
                        <Link href={{
                            pathname: "/update",
                            query: { id: item.id }
                        }}>
                            <a>Edit ✏</a>
                        </Link>
                    )}
                    <AddToCart id={item.id} />
                    {canDelete && (
                        <DeleteItem id={item.id} />
                    )}
                </div>
            </ItemStyles>
        )
    }
}
