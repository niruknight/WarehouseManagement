import React, { useState, useEffect } from 'react';
import  ButtonComponent  from '../../Components/Button/Button';
import api from '../../api';
import './CartPage.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from API
    api.get('/CartItem').then(response => {
      setCartItems(response.data);
    });
  }, []);

  const handleCheckout = () => {
    // Handle checkout logic
    api.post('/Invoice', { items: cartItems }).then(response => {
      alert('Checkout successful!');
    });
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <ButtonComponent onClick={handleCheckout}>Checkout</ButtonComponent>
    </div>
  );
};

export default Cart;
