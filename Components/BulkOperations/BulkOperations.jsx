import React, { useState } from 'react';

const BulkOperations = ({ selectedProducts, onSelectProducts, onBulkDelete, onBulkCategoryChange, onBulkPriceUpdate, onExport }) => {
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleCategoryChange = () => {
    onBulkCategoryChange(newCategory);
  };

  const handlePriceUpdate = () => {
    onBulkPriceUpdate(newPrice);
  };

  return (
    <div className="bulk-operations">
      <h3>Bulk Operations</h3>
      <div className="bulk-actions">
        <button onClick={onBulkDelete}>Delete Selected</button>
        <div className="bulk-category-change">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleCategoryChange}>Change Category</button>
        </div>
        <div className="bulk-price-update">
          <input
            type="number"
            placeholder="New Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button onClick={handlePriceUpdate}>Update Price</button>
        </div>
        <button onClick={onExport}>Export to Excel/CSV</button>
      </div>
    </div>
  );
};

export default BulkOperations;