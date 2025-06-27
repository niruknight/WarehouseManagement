import React, { useState } from 'react';
import api from '../../api';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, name, role } = response.data;

      localStorage.setItem('token', token);
      login({ name, role, token });

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
