import React, { useState } from 'react';
import './App.css';
import AuthForm from './AuthForm';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import AdminDashboard from './AdminDashboard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
  };

  const handleOrder = async (order) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...order, amount: 50000 }),
      });
      if (!res.ok) throw new Error('Order failed');
      alert('Order placed!');
      window.location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      <h1>🥩 MeatBooking App</h1>
      {!user ? (
        <div>
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Register</button>
          <AuthForm onAuth={handleAuth} isLogin={isLogin} />
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          {user.isAdmin && <p style={{ color: 'green' }}>👑 Admin User</p>}
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <h3>Book an Order</h3>
          <OrderForm onOrder={handleOrder} />
          <hr />
          <OrderSummary token={token} />
          {user.isAdmin && <AdminDashboard token={token} />}
        </div>
      )}
    </div>
  );
}

export default App;
