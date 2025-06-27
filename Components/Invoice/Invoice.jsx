// import React, { useState } from 'react';
// // Import jsPDF dynamically to avoid SSR issues with Vite
// import ButtonComponent from '../Button/Button';
// import './Invoice.css';

// const Invoice = ({ invoiceData, onPaymentComplete }) => {
//   const [isPaid, setIsPaid] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const handlePayment = () => {
//     setTimeout(() => {
//       setIsPaid(true);
//       onPaymentComplete();
//     }, 1000);
//   };

//   const handleDownloadInvoice = async () => {
//     setIsGenerating(true);
    
//     try {
//       // Dynamically import jsPDF and jspdf-autotable
//       const jsPDFModule = await import('jspdf');
//       const jsPDF = jsPDFModule.default;
//       // Import autotable to extend jsPDF
//       await import('jspdf-autotable');
      
//       // Create a new jsPDF instance
//       const doc = new jsPDF();
      
//       // Add logo or header (optional)
//       doc.setFontSize(22);
//       doc.setTextColor(44, 62, 80);
//       doc.text('INVOICE', 105, 20, { align: 'center' });
      
//       // Add invoice details
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0);
//       doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 14, 40);
//       doc.text(`Date: ${invoiceData.date}`, 14, 48);
      
//       // Add a line separator
//       doc.setDrawColor(220, 220, 220);
//       doc.line(14, 55, 196, 55);
      
//       // Add customer information
//       doc.setFontSize(14);
//       doc.text('Customer Information', 14, 65);
//       doc.setFontSize(11);
      
//       // Safely access customer information with fallbacks
//       const customerName = invoiceData.customer && invoiceData.customer.name ? 
//         invoiceData.customer.name : 'N/A';
//       const customerEmail = invoiceData.customer && invoiceData.customer.email ? 
//         invoiceData.customer.email : 'N/A';
        
//       doc.text(`Name: ${customerName}`, 14, 73);
//       doc.text(`Email: ${customerEmail}`, 14, 81);
      
//       // Prepare table data for items
//       const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
//       const tableRows = [];
      
//       // Add rows for each item safely checking properties
//       invoiceData.items.forEach(item => {
//         const product = item.product || {};
//         const productName = product.productName || product.name || 'Product';
//         const price = typeof product.price === 'number' ? product.price : 0;
//         const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
        
//         const row = [
//           productName,
//           quantity,
//           `$${price.toFixed(2)}`,
//           `$${(price * quantity).toFixed(2)}`
//         ];
//         tableRows.push(row);
//       });
      
//       // Generate the table
//       doc.autoTable({
//         head: [tableColumn],
//         body: tableRows,
//         startY: 90,
//         theme: 'striped',
//         headStyles: {
//           fillColor: [44, 62, 80],
//           textColor: [255, 255, 255],
//           fontStyle: 'bold'
//         },
//         margin: { top: 90 }
//       });
      
//       // Calculate total
//       const subtotal = typeof invoiceData.total === 'number' ? invoiceData.total : 0;
//       const tax = subtotal * 0.1;
//       const total = subtotal + tax;
      
//       // Add total after the table
//       const finalY = doc.lastAutoTable.finalY || 120;
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY + 10, { align: 'right' });
//       doc.text(`Tax (10%): $${tax.toFixed(2)}`, 150, finalY + 18, { align: 'right' });
//       doc.setFontSize(14);
//       doc.text(`Total: $${total.toFixed(2)}`, 150, finalY + 28, { align: 'right' });
      
//       // Add a thank you note
//       doc.setFontSize(11);
//       doc.setFont('helvetica', 'normal');
//       doc.text('Thank you for your business!', 105, finalY + 45, { align: 'center' });
      
//       // Save the PDF
//       doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("There was an error generating your invoice. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Safely calculate totals
//   const calculateSubtotal = () => {
//     if (!invoiceData || !invoiceData.items) return 0;
//     return invoiceData.items.reduce((sum, item) => {
//       if (!item.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
//         return sum;
//       }
//       return sum + (item.product.price * item.quantity);
//     }, 0);
//   };

//   const subtotal = invoiceData.total || calculateSubtotal();
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   return (
//     <div className="invoice-container">
//       <div className="invoice-header">
//         <h2>Invoice</h2>
//         <div className="invoice-meta">
//           <div><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</div>
//           <div><strong>Date:</strong> {invoiceData.date}</div>
//         </div>
//       </div>

//       <div className="customer-info">
//         <h3>Customer Information</h3>
//         <p>Name: {invoiceData.customer?.name || 'N/A'}</p>
//         <p>Email: {invoiceData.customer?.email || 'N/A'}</p>
//       </div>

//       <div className="invoice-items">
//         <h3>Order Items</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Quantity</th>
//               <th>Unit Price</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(invoiceData.items || []).map((item, index) => {
//               const product = item.product || {};
//               const productName = product.productName || product.name || 'Product';
//               const price = typeof product.price === 'number' ? product.price : 0;
//               const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
              
//               return (
//                 <tr key={index}>
//                   <td>{productName}</td>
//                   <td>{quantity}</td>
//                   <td>${price.toFixed(2)}</td>
//                   <td>${(price * quantity).toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="3" className="total-label">Subtotal</td>
//               <td className="total-amount">${subtotal.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td colSpan="3" className="total-label">Tax (10%)</td>
//               <td className="total-amount">${tax.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td colSpan="3" className="total-label">Total</td>
//               <td className="total-amount">${total.toFixed(2)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       <div className="invoice-actions">
//         {!isPaid ? (
//           <ButtonComponent text="Pay Now" onClick={handlePayment} className="payment-button" />
//         ) : (
//           <>
//             <div className="payment-confirmation">
//               <span className="payment-status">✓ Payment Complete</span>
//             </div>
//             <ButtonComponent 
//               text={isGenerating ? "Generating PDF..." : "Download Invoice"} 
//               onClick={handleDownloadInvoice} 
//               className="download-button"
//               disabled={isGenerating}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Invoice;





import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import ButtonComponent from '../Button/Button';
import './Invoice.css';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  customerInfo: {
    fontSize: 14,
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCell: {
    fontSize: 12,
  },
  total: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 10,
  },
});

const InvoiceDocument = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>INVOICE</Text>
      <View style={styles.customerInfo}>
        <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date}</Text>
        <Text>Customer: {invoiceData.customer?.name || 'N/A'}</Text>
        <Text>Email: {invoiceData.customer?.email || 'N/A'}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Item</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Unit Price</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total</Text>
          </View>
        </View>
        {invoiceData.items.map((item, index) => {
          const product = item.product || {};
          const productName = product.productName || product.name || 'Product';
          const price = typeof product.price === 'number' ? product.price : 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
          return (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{productName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${price.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${(price * quantity).toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.total}>Subtotal: ${invoiceData.total.toFixed(2)}</Text>
      <Text style={styles.total}>Tax (10%): ${(invoiceData.total * 0.1).toFixed(2)}</Text>
      <Text style={styles.total}>Total: ${(invoiceData.total * 1.1).toFixed(2)}</Text>
    </Page>
  </Document>
);

const Invoice = ({ invoiceData, onPaymentComplete }) => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    setTimeout(() => {
      setIsPaid(true);
      onPaymentComplete();
    }, 1000);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h2>Invoice</h2>
        <div className="invoice-meta">
          <div><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</div>
          <div><strong>Date:</strong> {invoiceData.date}</div>
        </div>
      </div>

      <div className="customer-info">
        <h3>Customer Information</h3>
        <p>Name: {invoiceData.customer?.name || 'N/A'}</p>
        <p>Email: {invoiceData.customer?.email || 'N/A'}</p>
      </div>

      <div className="invoice-items">
        <h3>Order Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(invoiceData.items || []).map((item, index) => {
              const product = item.product || {};
              const productName = product.productName || product.name || 'Product';
              const price = typeof product.price === 'number' ? product.price : 0;
              const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
              
              return (
                <tr key={index}>
                  <td>{productName}</td>
                  <td>{quantity}</td>
                  <td>${price.toFixed(2)}</td>
                  <td>${(price * quantity).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="total-label">Subtotal</td>
              <td className="total-amount">${invoiceData.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="total-label">Tax (10%)</td>
              <td className="total-amount">${(invoiceData.total * 0.1).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="total-label">Total</td>
              <td className="total-amount">${(invoiceData.total * 1.1).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="invoice-actions">
        {!isPaid ? (
          <ButtonComponent text="Pay Now" onClick={handlePayment} className="payment-button" />
        ) : (
          <>
            <div className="payment-confirmation">
              <span className="payment-status">✓ Payment Complete</span>
            </div>
            <PDFDownloadLink
              document={<InvoiceDocument invoiceData={invoiceData} />}
              fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
            >
              {({ loading }) => (
                <ButtonComponent 
                  text={loading ? "Generating PDF..." : "Download Invoice"} 
                  className="download-button"
                  disabled={loading}
                />
              )}
            </PDFDownloadLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;
