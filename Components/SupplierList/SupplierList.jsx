import React, { useState } from 'react';
import './SupplierList.css';

const SupplierList = ({ suppliers }) => {
  const [expandedSupplier, setExpandedSupplier] = useState(null);

  const toggleSupplierDetails = (supplierId) => {
    if (expandedSupplier === supplierId) {
      setExpandedSupplier(null);
    } else {
      setExpandedSupplier(supplierId);
    }
  };

  return (
    <div className="supplier-list">
      {suppliers.length === 0 ? (
        <div className="no-suppliers">No suppliers found</div>
      ) : (
        suppliers.map(supplier => (
          <div key={supplier.supplierID} className="supplier-card">
            <div 
              className="supplier-header"
              onClick={() => toggleSupplierDetails(supplier.supplierID)}
            >
              <h3>{supplier.supplierName}</h3>
              <div className="supplier-contact">{supplier.contactInfo}</div>
              <div className="expand-icon">
                {expandedSupplier === supplier.supplierID ? '▼' : '►'}
              </div>
            </div>
            
            {expandedSupplier === supplier.supplierID && (
              <div className="supplier-details">
                <h4>Products</h4>
                {supplier.products && supplier.products.length > 0 ? (
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>In Stock</th>
                        <th>Price</th>
                        <th>Barcode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.products.map(product => (
                        <tr 
                          key={product.productID}
                          className={product.quantity <= 10 ? 'low-stock' : ''}
                        >
                          <td>{product.productName}</td>
                          <td>{product.quantity}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.barcode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No products available from this supplier</p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SupplierList;