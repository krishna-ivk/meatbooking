import React, { useState } from 'react';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import Toast, { useToast } from './Toast';
import AuthForm from './AuthForm';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import AdminDashboard from './AdminDashboard';
import Analytics from './Analytics';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AppContent({ toast, showToast }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showToast(`Welcome back, ${data.user.name}!`, 'success');
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Order failed');
      }
      showToast('Order placed successfully!', 'success');
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
  };

  return (
    <div className="App">
      <h1>🥩 MeatBooking App</h1>
      {!user ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={() => setIsLogin(true)} style={{ marginRight: '10px' }}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>
          <AuthForm onAuth={handleAuth} isLogin={isLogin} />
        </div>
      ) : (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2>Welcome, {user.name}! 👋</h2>
            <p>Email: {user.email}</p>
            {user.isAdmin && <p style={{ color: '#ffd700' }}>👑 Admin User</p>}
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              marginTop: '10px'
            }}>
              Logout
            </button>
          </div>
          <hr />
          <h3>📦 Book an Order</h3>
          <OrderForm onOrder={handleOrder} />
          <hr />
          <OrderSummary token={token} />
          <Analytics token={token} />
          {user.isAdmin && <AdminDashboard token={token} />}
        </div>
      )}
      {toast && <Toast {...toast} onClose={() => showToast(null)} />}
    </div>
  );
}

function App() {
  const { toast, show: showToast } = useToast();

  return (
    <ErrorBoundary>
      <AppContent toast={toast} showToast={showToast} />
    </ErrorBoundary>
  );
}

export default App;
