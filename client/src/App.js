import React, { useState } from 'react';
import './App.css';
import AuthForm from './AuthForm';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import AdminDashboard from './AdminDashboard';

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
      const res = await fetch('http://localhost:5000/api/orders', {
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
          <button onClick={() => setUser(null)}>Logout</button>
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
