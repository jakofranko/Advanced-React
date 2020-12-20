import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RemoveCartItem from './RemoveCartItem';
import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
    padding: 1rem 0;
    border-bottom:  1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img {
        margin-right: 10px;
    }
    h3,
    p {
        margin: 0;
    }
`;

class CartItem extends Component {
    static propTypes = {
        cartItem: PropTypes.object.isRequired,
    }
    render() {
        const { cartItem } = this.props;
        const { item } = cartItem;
        return (
            <CartItemStyles>
                {!item && <p>This item has been removed.</p>}
                <img width="100" src={item.image} alt={item.title} />
                <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p>
                        {formatMoney(item.price * cartItem.quantity)}
                        {' - '}
                        <em>
                            {cartItem.quantity} &times; {formatMoney(item.price)}
                        </em>
                    </p>
                </div>
                <RemoveCartItem id={cartItem.id} />
            </CartItemStyles>
        );
    }

}

export default CartItem;
