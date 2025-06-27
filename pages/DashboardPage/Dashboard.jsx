import React from 'react';
import './Dashboard.css';
import Navbar from '../../Components/Navbar/Navbar';

const Dashboard = () => {
  return (
    <div className="dashboard">
      
      <div className="hero-section">
        <h2>Welcome to the Inventory Management System</h2>
        <p>Manage your inventory efficiently and effectively.</p>
        <div className="cta-buttons">
          <button className="cta-button">Get Started</button>
          <button className="cta-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;