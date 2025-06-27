import React, { useState, useEffect } from 'react';
import SupplierList from '../../Components/SupplierList/SupplierList';
import ProductShortageList from '../../Components/ProductShortageList/ProductShortageList';
import api from '../../api';
import './SupplierManagement.css';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shortageProducts, setShortageProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suppliers');
  
  // Threshold for considering a product as low in stock
  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    // Fetch suppliers and products data
    const fetchData = async () => {
      try {
        setLoading(true);
        const suppliersResponse = await api.get('/suppliers');
        setSuppliers(suppliersResponse.data);
        
        // Extract all products from suppliers data
        const allProducts = [];
        suppliersResponse.data.forEach(supplier => {
          if (supplier.products && supplier.products.length) {
            supplier.products.forEach(product => {
              allProducts.push({
                ...product,
                supplierID: supplier.supplierID,
                supplierName: supplier.supplierName
              });
            });
          }
        });
        
        setProducts(allProducts);
        
        // Identify products with low stock
        const lowStockProducts = allProducts.filter(product => 
          product.quantity <= LOW_STOCK_THRESHOLD
        );
        
        setShortageProducts(lowStockProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const placeOrder = async (productID, supplierID, quantity) => {
    try {
      // Create order in the backend
      await api.post('/CartItem', {
        productID,
        supplierID,
        quantity,
        orderDate: new Date().toISOString(),
        status: 'Pending'
      });
      
      // Show success notification (you can use a toast library here)
      alert(`Order placed successfully for Product ID: ${productID}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="supplier-management-container">
      <h2>Supplier Management</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveTab('suppliers')}
        >
          All Suppliers
        </button>
        <button 
          className={`tab ${activeTab === 'shortages' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortages')}
        >
          Product Shortages {shortageProducts.length > 0 && `(${shortageProducts.length})`}
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="tab-content">
          {activeTab === 'suppliers' && (
            <SupplierList 
              suppliers={suppliers}
            />
          )}
          
          {activeTab === 'shortages' && (
            <ProductShortageList 
              products={shortageProducts}
              onPlaceOrder={placeOrder}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;