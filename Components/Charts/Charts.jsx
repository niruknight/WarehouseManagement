import React from 'react';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Charts = ({ pieChartData, barChartData }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="charts-container">
      <div className="pie-chart">
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="bar-chart">
        <BarChart width={600} height={300} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Charts;
