import React, { useEffect, useState } from 'react';

const OrderSummary = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => setError('Failed to fetch orders'));
  }, [token]);

  if (!token) return <div>Please log in to view your orders.</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Your Orders</h3>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            {order.meatType} - {order.weight}kg x {order.quantity} | ₹{order.amount / 100} | Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSummary;
