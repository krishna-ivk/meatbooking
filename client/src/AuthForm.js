import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthForm = ({ onAuth, isLogin = true }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
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
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required disabled={loading} />
      )}
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required disabled={loading} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required disabled={loading} />
      <button type="submit" disabled={loading}>{loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default AuthForm;
