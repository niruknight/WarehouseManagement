import React from 'react';
import './Navbar.css';
import { useUser } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useUser();

  // If user is not logged in, don't show Navbar
  if (!user?.token) return null;

  return (
    <nav className="navbar">
      <div className="user-info">
        {user.name} ({user.role})
      </div>
      <button className="logout-button" onClick={logout}>
         <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
