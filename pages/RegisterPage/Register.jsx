import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './Register.css';


const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: ''});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name"
        value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email"
        value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password"
        value={formData.password} onChange={handleChange} required />
      
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
