import React from 'react';

const CartItem = React.memo(({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <span>{item.title} x {item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)}</span>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
});

export default CartItem;
