import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import api from '../../api';
import './Invoice.css';

const InvoicePage = () => {
  const { id } = useParams(); // Getting the ID from the URL
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (id) {
      // If an ID is provided, fetch the invoice data
      api.get(`/invoice/${id}`)
        .then(response => setInvoiceData(response.data))
        .catch(error => {
          console.error('Error fetching invoice:', error);
          if (error.response?.status === 404) {
            alert('Invoice not found.');
          }
        });
    } else {
      // Handle the case where no ID is passed (e.g., display a default message)
      setInvoiceData({ message: "No invoice selected" });
    }
  }, [id]);

  if (!invoiceData) return <div>Loading...</div>;

  return (
    <div className="invoice-container">
      {invoiceData.message ? (
        <p>{invoiceData.message}</p>
      ) : (
        <>
          <h2>Invoice Details</h2>
          <p>Invoice ID: {invoiceData.invoiceID}</p>
          <p>Date Issued: {invoiceData.dateIssued}</p>
          <p>Total Amount: ${invoiceData.totalAmount}</p>
          <p>User: {invoiceData.username}</p>
          <ul>
            {invoiceData.cartItems.map((item) => (
              <li key={item.cartItemID}>
                {item.productName} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InvoicePage;
