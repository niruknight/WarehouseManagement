import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ProductList.css';

const ProductList = ({ 
  categoryId, 
  categoryName, 
  clientView = false, 
  editMode = false, 
  deleteMode = false,
  onAddToCart 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    setLoading(true);
    
    // If categoryName is provided, fetch products by category name
    let endpoint = '/Products';
    if (categoryName) {
      endpoint = `/Products/category/${categoryName}`;
    }
    
    api.get(endpoint)
      .then(response => {
        setProducts(response.data);
        
        // Initialize quantities object for all products
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product.productID] = 1;
        });
        setQuantities(initialQuantities);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, [categoryName]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value, 10) || 1)
    }));
  };

  const handleAddToCart = (product) => {
    onAddToCart(product, quantities[product.productID]);
    
    // Reset the quantity input after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.productID]: 1
    }));
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (products.length === 0) return <div>No products found in this category.</div>;

  return (
    <div className="product-list">
      {categoryName && <h3>Products in {categoryName}</h3>}
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.productID} className="product-card">
            <h4>{product.productName}</h4>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>In Stock: {product.quantity}</p>
            
            {clientView && product.quantity > 0 && (
              <div className="add-to-cart-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(product.productID, quantities[product.productID] - 1)}
                    disabled={quantities[product.productID] <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={product.quantity}
                    value={quantities[product.productID]} 
                    onChange={(e) => handleQuantityChange(product.productID, e.target.value)}
                  />
                  <button 
                    onClick={() => handleQuantityChange(product.productID, quantities[product.productID] + 1)}
                    disabled={quantities[product.productID] >= product.quantity}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity < 1}
                >
                  Add to Cart
                </button>
              </div>
            )}
            
            {clientView && product.quantity <= 0 && (
              <div className="out-of-stock">Out of Stock</div>
            )}
            
            {editMode && (
              <button className="edit-button">Edit</button>
            )}
            
            {deleteMode && (
              <button className="delete-button">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;