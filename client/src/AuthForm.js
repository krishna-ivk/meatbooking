import React, { useState } from 'react';
import { useToast } from './Toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthForm = ({ onAuth, isLogin = true }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { show: showToast } = useToast();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!isLogin && form.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const url = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      setForm({ name: '', email: '', password: '' });
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input 
          name="name" 
          placeholder="Full Name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          disabled={loading} 
        />
      )}
      <input 
        name="email" 
        placeholder="Email Address" 
        type="email"
        value={form.email} 
        onChange={handleChange} 
        required 
        disabled={loading} 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        value={form.password} 
        onChange={handleChange} 
        required 
        disabled={loading} 
      />
      <button type="submit" disabled={loading}>
        {loading ? '⏳ Loading...' : isLogin ? '🔑 Login' : '✍️ Register'}
      </button>
      {error && (
        <div style={{
          color: '#dc3545',
          background: '#f8d7da',
          padding: '10px',
          borderRadius: '6px',
          marginTop: '10px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}
    </form>
  );
};

export default AuthForm;
