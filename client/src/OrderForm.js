import React, { useState } from 'react';

const meatPrices = {
  Chicken: 300,
  Mutton: 600,
  Beef: 500,
  Fish: 400,
};

const OrderForm = ({ onOrder }) => {
  const [form, setForm] = useState({ meatType: '', weight: '', quantity: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!form.meatType || !form.weight || !form.quantity) return 0;
    const price = meatPrices[form.meatType] || 0;
    return (price * form.weight * form.quantity).toFixed(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!form.meatType) throw new Error('Please select a meat type');
      if (!form.weight || form.weight <= 0) throw new Error('Weight must be greater than 0');
      if (!form.quantity || form.quantity <= 0) throw new Error('Quantity must be greater than 0');
      await onOrder(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit}>
      <select 
        name="meatType" 
        value={form.meatType} 
        onChange={handleChange} 
        required
        disabled={loading}
      >
        <option value="">🥩 Select Meat Type</option>
        <option value="Chicken">🐔 Chicken (₹300/kg)</option>
        <option value="Mutton">🐑 Mutton (₹600/kg)</option>
        <option value="Beef">🐄 Beef (₹500/kg)</option>
        <option value="Fish">🐟 Fish (₹400/kg)</option>
      </select>

      <input 
        name="weight" 
        type="number" 
        placeholder="Weight in kg" 
        value={form.weight} 
        onChange={handleChange} 
        required 
        min="0.1" 
        step="0.1"
        disabled={loading}
      />

      <input 
        name="quantity" 
        type="number" 
        placeholder="Quantity" 
        value={form.quantity} 
        onChange={handleChange} 
        required 
        min="1"
        disabled={loading}
      />

      {total > 0 && (
        <div style={{
          background: '#e7f3ff',
          padding: '12px',
          borderRadius: '6px',
          color: '#0066cc',
          fontWeight: 'bold',
          marginBottom: '10px',
          border: '1px solid #b3d9ff'
        }}>
          💰 Estimated Total: ₹{total}
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? '⏳ Booking...' : '📦 Book Order'}
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

export default OrderForm;
