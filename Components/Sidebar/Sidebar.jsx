import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faBox, faShoppingCart, faFileInvoice,
  faQrcode, faTruck, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const menuItems = [
    { label: 'Dashboard', icon: faTachometerAlt, path: '/dashboard', roles: ['Client', 'Manager', 'Admin'] },
    { label: 'Products', icon: faBox, path: '/products', roles: ['Client', 'Manager', 'Admin'] },
    // { label: 'Cart', icon: faShoppingCart, path: '/cart', roles: ['Client', 'Manager', 'Admin'] },
    // { label: 'Invoice', icon: faFileInvoice, path: '/invoice', roles: ['Client', 'Manager', 'Admin'] },
    { label: 'Barcode Scan', icon: faQrcode, path: '/scan', roles: ['Manager', 'Admin'] },
    { label: 'Supplier Management', icon: faTruck, path: '/suppliers', roles: ['Manager', 'Admin'] },
    { label: 'Sales Dashboard', icon: faChartLine, path: '/sales', roles: ['Admin'] },
  ];

  return (
    <aside className="sidebar">
      <ul>
        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <li key={item.label}>
              <Link to={item.path}>
                <FontAwesomeIcon icon={item.icon} /> {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
