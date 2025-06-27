import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/DashboardPage/Dashboard';
import ProductManagement from './pages/ProductManagement/ProductManagement';
import BarcodeScannerPage from './pages/BarCodeScanPage/BarCodePage';
import Cart from './pages/CartPage/CartPage.jsx';
import InvoicePage from './pages/InvoicePage/Invoice';
import InventoryManagement from './pages/InventoryManagementPage/InventoryManagement';
import SalesDashboard from './pages/SalesDashboard/SalesDashboard';
import SupplierManagement from './pages/SupplierManagementPage/SupplierManagement';
import LoginPage from './pages/LoginPage/Login';
import RegisterPage from './pages/RegisterPage/Register';
import Layout from './Components/Layout/Layout';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductManagement />
          </Layout>
        }
      />
      <Route
        path="/scan"
        element={
          <Layout>
            <BarcodeScannerPage />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/invoice"
        element={
          <Layout>
            <InvoicePage />
          </Layout>
        }
      />
      <Route
        path="/inventory"
        element={
          <Layout>
            <InventoryManagement />
          </Layout>
        }
      />
      <Route
        path="/sales"
        element={
          <Layout>
            <SalesDashboard />
          </Layout>
        }
      />
      <Route
        path="/suppliers"
        element={
          <Layout>
            <SupplierManagement />
          </Layout>
        }
      />
      {/* Catch-all route for unmatched paths */}
      <Route
        path="*"
        element={
        <Layout>
            <Dashboard />
        </Layout>
  }
/>

    </Routes>
  );
};

export default AppRouter;






// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Dashboard from './pages/DashboardPage/Dashboard';
// import ProductManagement from './pages/ProductManagement/ProductManagement';
// import BarcodeScannerPage from './pages/BarCodeScanPage/BarCodePage';
// // import CategoryManagement from './pages/CategoryManagement';
// // import SupplierManagement from './pages/SupplierManagement';
// // import InventoryTransactions from './pages/InventoryTransactions';
// // import UserManagement from './pages/UserManagement';
// // import ReportingAnalytics from './pages/ReportingAnalytics';

// const AppRouter = () => {
//   return (
//     <Routes>
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/products" element={<ProductManagement />} />
//       <Route path="/scan" element={<BarcodeScannerPage />} />
//       {/* <Route path="/categories" element={<CategoryManagement />} />
//       <Route path="/suppliers" element={<SupplierManagement />} />
//       <Route path="/transactions" element={<InventoryTransactions />} />
//       <Route path="/users" element={<UserManagement />} />
//       <Route path="/reports" element={<ReportingAnalytics />} />
//       <Route path="/" element={<Dashboard />} /> Default route */}
//     </Routes>
//   );
// };

// export default AppRouter;