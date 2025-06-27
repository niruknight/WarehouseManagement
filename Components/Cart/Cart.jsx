import React from 'react';
import ButtonComponent from '../Button/Button';
import './Cart.css';

const Cart = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onClose
}) => {
  // Calculate cart total
  const cartTotal = items.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );

  if (items.length === 0) {
    return (
      <div className="cart-overlay">
        <div className="cart-container">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <p className="empty-cart-message">Your cart is empty</p>
          <ButtonComponent text="Close" onClick={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-items">
          {items.map(item => (
            <div key={item.product.id} className="cart-item">
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">${item.product.price} each</p>
              </div>
              
              <div className="item-actions">
                <div className="quantity-control">
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-subtotal">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-button"
                  onClick={() => onRemoveItem(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="cart-total">
            <span className="total-label">Total:</span>
            <span className="total-amount">${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="cart-actions">
            <ButtonComponent 
              text="Continue Shopping" 
              onClick={onClose}
              className="secondary-button" 
            />
            <ButtonComponent 
              text="Proceed to Checkout" 
              onClick={onCheckout} 
              className="primary-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;