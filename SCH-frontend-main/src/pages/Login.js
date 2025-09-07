import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/api/v1/users/login`, {
        email,
        password
      });

      const { token } = response.data.data;

      // Use AuthContext login() method
      login(token);

      setMessage('Login successful!');
      setEmail('');
      setPassword('');

      navigate('/posts');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setMessage(`Error: ${err.response.data.detail}`);
      } else {
        setMessage('Error logging in. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">Login</button>
      </form>
      
      <div className="switch">
        Don’t have an account? <Link to="/signup">Sign up here</Link>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
