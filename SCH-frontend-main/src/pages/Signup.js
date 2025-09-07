import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // ✅ 1. Register the user
      await axios.post(`${API_URL}/api/v1/users/sign-up`, {
        email,
        password,
        name
      });

      // ✅ 2. Auto-login immediately
      const loginResponse = await axios.post(`${API_URL}/api/v1/users/login`, {
        email,
        password
      });

      const { token } = loginResponse.data.data;
      login(token);

      setMessage('Signup and login successful!');
      setEmail('');
      setPassword('');
      setName('');

      // ✅ 3. Redirect to posts page
      navigate('/posts');
    } catch (err) {
      console.error('Signup error:', err);

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (typeof detail === 'string') {
          setMessage(`Error: ${detail}`);
        } else if (Array.isArray(detail)) {
          const messages = detail.map(item => {
            const path = item.loc ? item.loc.join('.') : '';
            return `${path}: ${item.msg}`;
          });
          setMessage(`Error: ${messages.join(', ')}`);
        } else if (typeof detail === 'object') {
          setMessage(`Error: ${JSON.stringify(detail, null, 2)}`);
        } else {
          setMessage(`Error: ${JSON.stringify(err.response.data)}`);
        }
      } else {
        setMessage('Error signing up. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Name:</label><br />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password:</label><br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
          />
        </div>
        <button type="submit" style={{
          backgroundColor: '#43a047',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>Sign Up</button>
      </form>
      {message && <p style={{ marginTop: '16px', color: 'red' }}>{message}</p>}
    </div>
  );
}
