import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OrderSummary = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`${API_BASE_URL}/orders/my`, {
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

  if (!token) return <div>Please log in to view your orders.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Your Orders ({orders.length})</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              {order.meatType} - {order.weight}kg x {order.quantity} | ₹{order.amount / 100} | Status: <strong>{order.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderSummary;
