import React, { useState } from 'react';
import './ProductShortageList.css';

const ProductShortageList = ({ products, onPlaceOrder }) => {
  const [orderQuantities, setOrderQuantities] = useState({});

  const handleQuantityChange = (productId, value) => {
    setOrderQuantities({
      ...orderQuantities,
      [productId]: value
    });
  };

  const handlePlaceOrder = (product) => {
    const quantity = orderQuantities[product.productID] || 1;
    onPlaceOrder(product.productID, product.supplierID, parseInt(quantity, 10));
  };

  return (
    <div className="product-shortage-list">
      <h3>Products Low in Stock</h3>
      
      {products.length === 0 ? (
        <div className="no-shortages">
          <p>No product shortages detected.</p>
        </div>
      ) : (
        <table className="shortages-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Supplier</th>
              <th>Price</th>
              <th>Order Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.productID} className="shortage-item">
                <td>{product.productName}</td>
                <td className="stock-level">
                  <span className="low-stock-indicator">{product.quantity}</span>
                </td>
                <td>{product.supplierName}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantities[product.productID] || ""}
                    onChange={(e) => handleQuantityChange(product.productID, e.target.value)}
                    placeholder="Qty"
                    className="quantity-input"
                  />
                </td>
                <td>
                  <button 
                    className="order-button"
                    onClick={() => handlePlaceOrder(product)}
                  >
                    Place Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductShortageList;