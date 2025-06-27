import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './Router';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppRouter />
      </div>
    </Router>
  );
};

export default App;
