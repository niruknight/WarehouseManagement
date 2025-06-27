import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import ProductList from '../../Components/ProductList/ProductList';
import FormComponent from '../../Components/Form/Form';
import DeleteConfirmation from '../../Components/DeleteConfirmation/DeleteConfirmation';
import BulkOperations from '../../Components/BulkOperations/BulkOperations';
import QrScanner from '../../Components/QrScannerComponent/QrScanner';
import Cart from '../../Components/Cart/Cart';
import Invoice from '../../Components/Invoice/Invoice';
import { useUser } from '../../context/UserContext';
import api from '../../api';
import './ProductManagement.css';
import BarcodePage from '../BarCodeScanPage/BarCodePage';

const ProductManagement = () => {
  const { user, logout } = useUser();
  
  const [currentView, setCurrentView] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  
  // Cart related states
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/Categories')
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
        setLoading(false);
        // Fallback to all the listed categories if API fails
        setCategories([
          { categoryID: 1, categoryName: 'Electronics' },
          { categoryID: 2, categoryName: 'Clothing' },
          { categoryID: 3, categoryName: 'Home Appliances' },
          { categoryID: 4, categoryName: 'Furniture' },
          { categoryID: 5, categoryName: 'Books' },
          { categoryID: 6, categoryName: 'Sports Equipment' },
          { categoryID: 7, categoryName: 'Beauty & Personal Care' },
          { categoryID: 8, categoryName: 'Toys & Games' },
          { categoryID: 9, categoryName: 'Groceries' },
          { categoryID: 10, categoryName: 'Office Supplies' }
        ]);
      });
  };

  useEffect(() => {
    // Fetch categories from the database
    fetchCategories();
  }, []);

  // Fix the barcode scanner initialization
  useEffect(() => {
    if (currentView === 'scan' && !scannerInitialized) {
      // Initialize scanner when the scan view is active
      setScannerInitialized(true);
      // Reset when view changes
      return () => setScannerInitialized(false);
    }
  }, [currentView]);

  const handleScan = async (barcode) => {
    if (!barcode) {
      console.log('No barcode data received');
      return;
    }
    
    setScannedData(barcode);
    
    try {
      // Use the correct API endpoint and pass barcode as JSON body
      const response = await api.post('/api/Products/scan', { barcode: barcode }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200) {
        alert('Product found! Quantity incremented.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Product not found. Please add new product.');
        setCurrentView('add');
      } else {
        alert(`Error scanning product: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    const category = categories.find(cat => cat.categoryID === categoryId);
    setSelectedCategory(category);
  };
  
  // Function to add product to cart
  const addToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.product.productID === product.productID);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.productID === product.productID 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };
  
  // Function to remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.productID !== productId));
  };
  
  // Function to update item quantity in cart
  const updateCartItemQuantity = (productId, quantity) => {
    setCart(cart.map(item => 
      item.product.productID === productId
        ? { ...item, quantity }
        : item
    ));
  };
  
  // Function to process checkout
  const handleCheckout = () => {
    // Calculate total
    const total = cart.reduce((sum, item) => 
      sum + ((item.product.price || 0) * item.quantity), 0);
    
    // Generate invoice data
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: user,
      items: cart,
      total: total,
    };
    
    setInvoice(invoiceData);
    setShowInvoice(true);
    
    // Update stock quantities in the backend
    const stockUpdateRequest = {
      products: cart.map(item => ({
        productID: item.product.productID,
        quantityPurchased: item.quantity
      }))
    };
    
    api.post('/Products/update-stock', stockUpdateRequest)
      .then(response => {
        console.log('Stock updated successfully');
      })
      .catch(error => {
        console.error('Error updating stock:', error);
        setError('Failed to update product stock. Please try again.');
      });
  };
  
  // Function to handle payment completion
  const handlePaymentComplete = () => {
    // Clear cart after successful payment
    setCart([]);
    // Keep showing the invoice for download
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Function to handle view changes (for Admin/Manager)
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  
  // Function to go back to previous menu
  const handleBack = () => {
    // Navigate back to the main page
    window.history.back();
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (!user || !user.role) {
    return <p>Loading user data...</p>;
  }

  return (
    <Layout user={user} onLogout={logout}>
      {/* Client Flow */}
      {user.role === 'Client' && (
        <>
          {!showInvoice ? (
            <>
              <div className="client-header">
                <h2>Select a Category</h2>
                <button 
                  className="cart-button" 
                  onClick={toggleCart}
                >
                  Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              </div>
              
              <select onChange={handleCategoryChange} defaultValue="" className="category-dropdown">
                <option key="default" value="" disabled>Select category</option>
                {categories.map(cat => (
                  <option key={cat.categoryID} value={cat.categoryID}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <ProductList 
                  categoryId={selectedCategory.categoryID}
                  categoryName={selectedCategory.categoryName}
                  clientView={true}
                  onAddToCart={addToCart}
                />
              )}
              
              {showCart && (
                <Cart 
                  items={cart}
                  onUpdateQuantity={updateCartItemQuantity}
                  onRemoveItem={removeFromCart}
                  onCheckout={handleCheckout}
                  onClose={toggleCart}
                />
              )}
            </>
          ) : (
            <Invoice 
              invoiceData={invoice}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
        </>
      )}

      {/* Admin/Manager View Options */}
      {(user.role === 'Admin' || user.role === 'Manager') && (
        <div className="product-management">
          <div className="layout">
            <aside className="sidebar">
              {/* Add a back button */}
              <button className="back-button" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
              <h2>Product Management</h2>
              <div className="options">
                <div className="option" onClick={() => handleViewChange('view')} aria-label="View Products">
                  <i className="fas fa-eye"></i>
                  <span>View Products</span>
                </div>
                <div className="option" onClick={() => handleViewChange('add')} aria-label="Add Product">
                  <i className="fas fa-plus"></i>
                  <span>Add Product</span>
                </div>
                <div className="option" onClick={() => handleViewChange('edit')} aria-label="Edit Product">
                  <i className="fas fa-edit"></i>
                  <span>Edit Product</span>
                </div>
                <div className="option" onClick={() => handleViewChange('delete')} aria-label="Delete Product">
                  <i className="fas fa-trash"></i>
                  <span>Delete Product</span>
                </div>
                <div className="option" onClick={() => handleViewChange('bulk')} aria-label="Bulk Operations">
                  <i className="fas fa-tasks"></i>
                  <span>Bulk Operations</span>
                </div>
                <div className="option" onClick={() => handleViewChange('scan')} aria-label="Scan Barcode">
                  <i className="fas fa-barcode"></i>
                  <span>Scan Barcode</span>
                </div>
              </div>
            </aside>
            <main className="main-content">
              {currentView === '' && (
                <div className="welcome-message">
                  <h2>Welcome to Product Management</h2>
                  <p>Select an option from the sidebar to get started.</p>
                </div>
              )}
              {currentView === 'view' && <ProductList />}
              {currentView === 'add' && (
                <FormComponent
                  fields={[
                    { name: 'productName', type: 'text', placeholder: 'Product Name', required: true },
                    { name: 'barcode', type: 'text', placeholder: 'Barcode', value: scannedData || '', required: true },
                    { name: 'categoryID', type: 'dropdown', 
                      options: categories.map(cat => ({ value: cat.categoryID, label: cat.categoryName })), 
                      placeholder: 'Category' },
                    { name: 'supplierID', type: 'number', placeholder: 'Supplier ID', required: true },
                    { name: 'quantity', type: 'number', placeholder: 'Quantity', required: true },
                    { name: 'price', type: 'number', placeholder: 'Unit Price', required: true },
                  ]}
                  onSubmit={(formData) => {
                    api.post('/api/Products', formData)
                      .then(response => {
                        alert('Product added successfully!');
                        setScannedData(null);
                        // Reset form or redirect
                      })
                      .catch(error => {
                        alert(`Error adding product: ${error.message}`);
                      });
                  }}
                  buttonText="Add Product"
                />
              )}
              {currentView === 'edit' && <ProductList editMode />}
              {currentView === 'delete' && (
                <>
                  <ProductList deleteMode />
                  {showDeleteConfirmation && (
                    <DeleteConfirmation onConfirm={(confirm) => {
                      if (confirm) {
                        // Delete logic here
                      }
                      setShowDeleteConfirmation(false);
                    }} />
                  )}
                </>
              )}
              {currentView === 'bulk' && (
                <BulkOperations
                  selectedProducts={selectedProducts}
                  onSelectProducts={setSelectedProducts}
                  onBulkDelete={() => setShowDeleteConfirmation(true)}
                  onBulkCategoryChange={(newCategory) => {
                    // Bulk category change logic here
                  }}
                  onBulkPriceUpdate={(newPrice) => {
                    // Bulk price update logic here
                  }}
                  onExport={() => {
                    // Export logic here
                  }}
                />
              )}
              {currentView === 'scan' && (
                <div className="scanner-container">
                  <h3>Scan Product Barcode</h3>
                  <QrScanner
                    onScan={handleScan}
                    key={scannerInitialized ? 'scanner-active' : 'scanner-inactive'} 
                  />
                  {scannedData && (
                    <div className="scanned-data">
                      <p>Scanned Barcode: <strong>{scannedData}</strong></p>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </Layout>
  );
};

export default ProductManagement;



// import React, { useState } from 'react';
// import Navbar from '../../Components/Navbar/Navbar.jsx';
// import ProductList from '../../Components/ProductList/ProductList.jsx';
// import FormComponent from '../../Components/Form/Form.jsx';
// import DeleteConfirmation from '../../Components/DeleteConfirmation/DeleteConfirmation.jsx';
// import BulkOperations from '../../Components/BulkOperations/BulkOperations.jsx';
// import './ProductManagement.css';

// const ProductManagement = () => {
//   const [currentView, setCurrentView] = useState('');
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(true);

//   const handleViewChange = (view) => {
//     setCurrentView(view);
//   };

//   const toggleSidebar = () => {
//     setSidebarVisible(!sidebarVisible);
//   };

//   const handleDeleteConfirmation = (confirm) => {
//     if (confirm) {
//       // Delete logic here
//     }
//     setShowDeleteConfirmation(false);
//   };

//   return (
//     <div className="product-management">
//       <Navbar showToggleButton={true} toggleSidebar={toggleSidebar} />
//       <div className="layout">
//         {sidebarVisible && (
//           <aside className="sidebar">
//             <h2>Product Management</h2>
//             <div className="options">
//               <div className="option" onClick={() => handleViewChange('view')} aria-label="View Products">
//                 <i className="fas fa-eye"></i>
//                 <span>View Products</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('add')} aria-label="Add Product">
//                 <i className="fas fa-plus"></i>
//                 <span>Add Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('edit')} aria-label="Edit Product">
//                 <i className="fas fa-edit"></i>
//                 <span>Edit Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('delete')} aria-label="Delete Product">
//                 <i className="fas fa-trash"></i>
//                 <span>Delete Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('bulk')} aria-label="Bulk Operations">
//                 <i className="fas fa-tasks"></i>
//                 <span>Bulk Operations</span>
//               </div>
//             </div>
//           </aside>
//         )}
//         <main className="main-content">
//           {currentView === '' && (
//             <div className="welcome-message">
//               <h2>Welcome to Product Management</h2>
//               <p>Select an option from the sidebar to get started.</p>
//             </div>
//           )}
//           {currentView === 'view' && <ProductList />}
//           {currentView === 'add' && (
//             <FormComponent
//               fields={[
//                 { name: 'name', type: 'text', placeholder: 'Product Name', required: true },
//                 { name: 'description', type: 'text', placeholder: 'Description' },
//                 { name: 'category', type: 'dropdown', options: ['Category 1', 'Category 2'], placeholder: 'Category' },
//                 { name: 'quantity', type: 'number', placeholder: 'Quantity' },
//                 { name: 'price', type: 'number', placeholder: 'Unit Price' },
//                 { name: 'supplier', type: 'dropdown', options: ['Supplier 1', 'Supplier 2'], placeholder: 'Supplier' },
//                 { name: 'expiryDate', type: 'date', placeholder: 'Expiry Date' },
//               ]}
//               onSubmit={(newProduct) => {
//                 // Add product logic here
//               }}
//               buttonText="Add Product"
//             />
//           )}
//           {currentView === 'edit' && <ProductList editMode />}
//           {currentView === 'delete' && (
//             <>
//               <ProductList deleteMode />
//               {showDeleteConfirmation && (
//                 <DeleteConfirmation onConfirm={handleDeleteConfirmation} />
//               )}
//             </>
//           )}
//           {currentView === 'bulk' && (
//             <BulkOperations
//               selectedProducts={selectedProducts}
//               onSelectProducts={setSelectedProducts}
//               onBulkDelete={() => setShowDeleteConfirmation(true)}
//               onBulkCategoryChange={(newCategory) => {
//                 // Bulk category change logic here
//               }}
//               onBulkPriceUpdate={(newPrice) => {
//                 // Bulk price update logic here
//               }}
//               onExport={() => {
//                 // Export logic here
//               }}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;

// import React, { useState } from 'react';
// import Navbar from '../../Components/Navbar/Navbar.jsx';
// import ProductList from '../../Components/ProductList/ProductList.jsx';
// import FormComponent from '../../Components/Form/Form.jsx';
// import DeleteConfirmation from '../../Components/DeleteConfirmation/DeleteConfirmation.jsx';
// import BulkOperations from '../../Components/BulkOperations/BulkOperations.jsx';
// import './ProductManagement.css';

// const ProductManagement = () => {
//   const [currentView, setCurrentView] = useState('');
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(true);

//   const handleViewChange = (view) => {
//     setCurrentView(view);
//   };

//   const toggleSidebar = () => {
//     setSidebarVisible(!sidebarVisible);
//   };

//   const handleDeleteConfirmation = (confirm) => {
//     if (confirm) {
//       // Delete logic here
//     }
//     setShowDeleteConfirmation(false);
//   };

//   return (
//     <div className="product-management">
//       <Navbar showToggleButton={true} toggleSidebar={toggleSidebar} />
//       <div className="layout">
//         {sidebarVisible && (
//           <aside className="sidebar">
//             <h2>Product Management</h2>
//             <div className="options">
//               <div className="option" onClick={() => handleViewChange('view')} aria-label="View Products">
//                 <i className="fas fa-eye"></i>
//                 <span>View Products</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('add')} aria-label="Add Product">
//                 <i className="fas fa-plus"></i>
//                 <span>Add Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('edit')} aria-label="Edit Product">
//                 <i className="fas fa-edit"></i>
//                 <span>Edit Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('delete')} aria-label="Delete Product">
//                 <i className="fas fa-trash"></i>
//                 <span>Delete Product</span>
//               </div>
//               <div className="option" onClick={() => handleViewChange('bulk')} aria-label="Bulk Operations">
//                 <i className="fas fa-tasks"></i>
//                 <span>Bulk Operations</span>
//               </div>
//             </div>
//           </aside>
//         )}
//         <main className="main-content">
//           {currentView === '' && (
//             <div className="welcome-message">
//               <h2>Welcome to Product Management</h2>
//               <p>Select an option from the sidebar to get started.</p>
//             </div>
//           )}
//           {currentView === 'view' && <ProductList />}
//           {currentView === 'add' && (
//             <FormComponent
//               fields={[
//                 { name: 'name', type: 'text', placeholder: 'Product Name', required: true },
//                 { name: 'description', type: 'text', placeholder: 'Description' },
//                 { name: 'category', type: 'dropdown', options: ['Category 1', 'Category 2'], placeholder: 'Category' },
//                 { name: 'quantity', type: 'number', placeholder: 'Quantity' },
//                 { name: 'price', type: 'number', placeholder: 'Unit Price' },
//                 { name: 'supplier', type: 'dropdown', options: ['Supplier 1', 'Supplier 2'], placeholder: 'Supplier' },
//                 { name: 'expiryDate', type: 'date', placeholder: 'Expiry Date' },
//               ]}
//               onSubmit={(newProduct) => {
//                 // Add product logic here
//               }}
//               buttonText="Add Product"
//             />
//           )}
//           {currentView === 'edit' && <ProductList editMode />}
//           {currentView === 'delete' && (
//             <>
//               <ProductList deleteMode />
//               {showDeleteConfirmation && (
//                 <DeleteConfirmation onConfirm={handleDeleteConfirmation} />
//               )}
//             </>
//           )}
//           {currentView === 'bulk' && (
//             <BulkOperations
//               selectedProducts={selectedProducts}
//               onSelectProducts={setSelectedProducts}
//               onBulkDelete={() => setShowDeleteConfirmation(true)}
//               onBulkCategoryChange={(newCategory) => {
//                 // Bulk category change logic here
//               }}
//               onBulkPriceUpdate={(newPrice) => {
//                 // Bulk price update logic here
//               }}
//               onExport={() => {
//                 // Export logic here
//               }}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;
