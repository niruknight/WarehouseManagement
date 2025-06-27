import React, { useState, useEffect } from 'react';
import api from '../../api';
import './InventoryTransactionList.css';

const InventoryTransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <div className="transaction-list">
      {transactions.map(transaction => (
        <div key={transaction.id} className="transaction-item">
          <h2>{transaction.productName}</h2>
          <p>Quantity: {transaction.quantity}</p>
          <p>Date: {transaction.date}</p>
        </div>
      ))}
    </div>
  );
};

export default InventoryTransactionList;