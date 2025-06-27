import React, { useState, useEffect } from 'react';
import api from '../../api';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className="category-list">
      {categories.map(category => (
        <div key={category.id} className="category-item">
          <h2>{category.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;