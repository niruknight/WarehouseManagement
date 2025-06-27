import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';
import { useUser } from '../../context/UserContext';

const Layout = ({ children }) => {
  const { user, logout } = useUser();

  // Redirect if user is not logged in
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-wrapper">
      <Navbar user={user} logout={logout} />
      <div className="main-layout">
        <Sidebar role={user.role} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
