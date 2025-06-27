import React, { useState, useEffect } from 'react';
import Charts from '../../Components/Charts/Charts';
import api from '../../api';
import './SalesDashboard.css';

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState({ pieChartData: [], barChartData: [] });

  useEffect(() => {
    api.get('/sales').then(response => {
      setSalesData(response.data);
    });
  }, []);

  return (
    <div className="sales-dashboard-container">
      <h2>Sales Dashboard</h2>
      <Charts pieChartData={salesData.pieChartData} barChartData={salesData.barChartData} />
    </div>
  );
};

export default SalesDashboard;
