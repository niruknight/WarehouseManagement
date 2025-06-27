import React, { useState, useEffect } from 'react';
import  InventoryTransaction  from '../../Components/InventoryTransactionList/InventoryTransactionList';
import api from '../../api';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Fetch inventory from API
    api.get('/inventory').then(response => {
      setInventory(response.data);
    });
  }, []);

  return (
    <div className="inventory-management-container">
      <h2>Inventory Management</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}
            <InventoryTransaction item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManagement;
