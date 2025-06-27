import axios from 'axios'

const token = localStorage.getItem('token'); // or sessionStorage

const api = axios.create({
  baseURL: 'https://localhost:7250/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, //  Important for authentication
  },
});

export default api;
