import React, { useState } from 'react';

const OrderForm = ({ onOrder }) => {
  const [form, setForm] = useState({ meatType: '', weight: '', quantity: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await onOrder(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="meatType" value={form.meatType} onChange={handleChange} required>
        <option value="">Select Meat Type</option>
        <option value="Chicken">Chicken</option>
        <option value="Mutton">Mutton</option>
        <option value="Beef">Beef</option>
        <option value="Fish">Fish</option>
      </select>
      <input name="weight" type="number" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required min="0.1" step="0.1" />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required min="1" />
      <button type="submit">Book Order</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default OrderForm;
