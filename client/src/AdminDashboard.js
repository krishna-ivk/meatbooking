import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError('Invalid response format');
        }
      })
      .catch(err => setError('Failed to fetch orders'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      alert('Order status updated!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (!token) return <div>Admin access required.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>👑 Admin Dashboard - All Orders ({orders.length})</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id} style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5' }}>
              <strong>{order.meatType}</strong> - {order.weight}kg x {order.quantity} | 
              ₹{order.amount / 100} | 
              User: {order.user?.name} ({order.user?.email})
              <br />
              Status: <strong>{order.status}</strong>
              <br />
              <select 
                value={order.status} 
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                disabled={updating === order._id}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {updating === order._id && <span> Updating...</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
