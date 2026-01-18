import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => setError('Failed to fetch orders'));
  }, [token]);

  if (!token) return <div>Admin access required.</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>All Orders (Admin)</h3>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            {order.meatType} - {order.weight}kg x {order.quantity} | ₹{order.amount / 100} | Status: {order.status} | User: {order.user?.name} ({order.user?.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
