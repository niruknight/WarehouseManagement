// import React, { useState } from 'react';
// import QrScanner from '../../Components/QrScannerComponent/QrScanner.jsx';
// import FormComponent from '../../Components/Form/Form'; 
// import api from '../../api';
// import './BarcodePage.css';

// const BarcodePage = () => {
//   const [scannedBarcode, setScannedBarcode] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [scanStatus, setScanStatus] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleScan = async (barcode) => {
//     if (!barcode) return;
    
//     setScannedBarcode(barcode);
//     setScanStatus('Scanning...');
//     setLoading(true);
    
//     try {
//       // Use the correct API endpoint and pass barcode as JSON body
//       const response = await api.post('/api/Products/scan', { barcode }, {
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//       if (response.status === 200) {
//         setScanStatus('Product found! Quantity incremented.');
//         // Scroll to the status message
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//         setTimeout(() => setScanStatus(''), 3000);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setScanStatus('Product not found. Please add new product.');
//         setShowForm(true);
//         // Scroll to the form
//         setTimeout(() => {
//           const formElement = document.querySelector('.product-form-container');
//           if (formElement) {
//             formElement.scrollIntoView({ behavior: 'smooth' });
//           }
//         }, 100);
//       } else {
//         setScanStatus(`Error scanning product: ${error.message || 'Unknown error'}`);
//         setTimeout(() => setScanStatus(''), 3000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = async (formData) => {
//     setLoading(true);
//     try {
//       await api.post('/api/Products', {
//         ...formData,
//         barcode: scannedBarcode,
//       });
//       setScanStatus('Product added successfully!');
//       setShowForm(false);
//       setScannedBarcode(null);
//       // Scroll back to top
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       setTimeout(() => setScanStatus(''), 3000);
//     } catch (error) {
//       setScanStatus(`Error adding product: ${error.message || 'Unknown error'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelForm = () => {
//     setShowForm(false);
//     setScannedBarcode(null);
//     setScanStatus('');
//     // Scroll back to scanner
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const productFormFields = [
//     { name: 'productName', type: 'text', placeholder: 'Product Name', required: true },
//     { name: 'categoryID', type: 'number', placeholder: 'Category ID', required: true },
//     { name: 'supplierID', type: 'number', placeholder: 'Supplier ID', required: true },
//     { name: 'quantity', type: 'number', placeholder: 'Quantity', required: true },
//     { name: 'price', type: 'number', placeholder: 'Price', required: true },
//     // Hidden barcode field will be added automatically
//   ];

//   return (
//     <div className="barcode-scanner-page">
//       <h2>Scan Product Barcode</h2>
      
//       {scanStatus && (
//         <div className={`status-message ${scanStatus.includes('Error') ? 'error' : 'success'}`}>
//           {scanStatus}
//         </div>
//       )}
      
//       {scannedBarcode && (
//         <div className="scanned-barcode">
//           <p>Scanned Barcode: <strong>{scannedBarcode}</strong></p>
//         </div>
//       )}
      
//       {!showForm && <QrScanner onScan={handleScan} />}
      
//       {showForm && (
//         <div className="product-form-container">
//           <h3>Add New Product</h3>
//           <FormComponent 
//             fields={productFormFields} 
//             onSubmit={handleAddProduct} 
//             buttonText="Add Product"
//             loading={loading}
//           />
//           <button 
//             className="cancel-button" 
//             onClick={handleCancelForm}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BarcodePage;


import React, { useState } from 'react';
import QrScanner from '../../Components/QrScannerComponent/QrScanner.jsx';
import FormComponent from '../../Components/Form/Form'; 
import api from '../../api';
import './BarcodePage.css';

const BarcodePage = () => {
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showQuantityPrompt, setShowQuantityPrompt] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingProductId, setExistingProductId] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const handleScan = async (barcode) => {
    if (!barcode) return;
    
    setScannedBarcode(barcode);
    setScanStatus('Scanning...');
    setLoading(true);
    
    try {
      // Check if the product exists
      const response = await api.post('/Products/scan', { barcode }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200 && response.data.product) {
        // Product exists - show quantity prompt
        setExistingProductId(response.data.product.productID);
        setShowQuantityPrompt(true);
        setScanStatus(`Found product: ${response.data.product.productName}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Product not found - show add product form
        setScanStatus('Product not found. Please add new product.');
        setShowForm(true);
        // Scroll to the form
        setTimeout(() => {
          const formElement = document.querySelector('.product-form-container');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setScanStatus(`Error scanning product: ${error.message || 'Unknown error'}`);
        setTimeout(() => setScanStatus(''), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    setLoading(true);
    try {
      await api.post('/api/Products', {
        ...formData,
        barcode: scannedBarcode,
      });
      setScanStatus('Product added successfully!');
      setShowForm(false);
      setScannedBarcode(null);
      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setScanStatus(''), 3000);
    } catch (error) {
      setScanStatus(`Error adding product: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async () => {
    if (!existingProductId || quantityToAdd <= 0) return;
    
    setLoading(true);
    try {
      // Call the API to update quantity
      await api.post('/Products/update-quantity', {
        productId: existingProductId,
        quantity: quantityToAdd
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setScanStatus(`Product quantity updated by ${quantityToAdd}!`);
      setShowQuantityPrompt(false);
      setScannedBarcode(null);
      setQuantityToAdd(1);
      
      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setScanStatus(''), 3000);
    } catch (error) {
      setScanStatus(`Error updating quantity: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowQuantityPrompt(false);
    setScannedBarcode(null);
    setScanStatus('');
    setQuantityToAdd(1);
    // Scroll back to scanner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productFormFields = [
    { name: 'productName', type: 'text', placeholder: 'Product Name', required: true },
    { name: 'categoryID', type: 'number', placeholder: 'Category ID', required: true },
    { name: 'supplierID', type: 'number', placeholder: 'Supplier ID', required: true },
    { name: 'quantity', type: 'number', placeholder: 'Quantity', required: true },
    { name: 'price', type: 'number', placeholder: 'Price', required: true },
    // Hidden barcode field will be added automatically
  ];

  return (
    <div className="barcode-scanner-page">
      <h2>Scan Product Barcode</h2>
      
      {scanStatus && (
        <div className={`status-message ${scanStatus.includes('Error') ? 'error' : 'success'}`}>
          {scanStatus}
        </div>
      )}
      
      {scannedBarcode && (
        <div className="scanned-barcode">
          <p>Scanned Barcode: <strong>{scannedBarcode}</strong></p>
        </div>
      )}
      
      {!showForm && !showQuantityPrompt && <QrScanner onScan={handleScan} />}
      
      {showQuantityPrompt && (
        <div className="quantity-prompt-container">
          <h3>Update Product Quantity</h3>
          <div className="quantity-input-group">
            <label htmlFor="quantity">How many to add?</label>
            <input
              type="number"
              id="quantity"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(parseInt(e.target.value) || 0)}
              min="1"
              className="quantity-input"
            />
          </div>
          <div className="button-group">
            <button 
              className="update-button" 
              onClick={handleUpdateQuantity}
              disabled={loading || quantityToAdd <= 0}
            >
              {loading ? 'Updating...' : 'Update Quantity'}
            </button>
            <button 
              className="cancel-button" 
              onClick={handleCancelForm}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {showForm && (
        <div className="product-form-container">
          <h3>Add New Product</h3>
          <FormComponent 
            fields={productFormFields} 
            onSubmit={handleAddProduct} 
            buttonText="Add Product"
            loading={loading}
          />
          <button 
            className="cancel-button" 
            onClick={handleCancelForm}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodePage;