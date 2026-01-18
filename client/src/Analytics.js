import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Analytics = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    meatBreakdown: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          const meatBreakdown = {};
          let totalRevenue = 0;
          let deliveredCount = 0;
          let pendingCount = 0;

          data.forEach(order => {
            totalRevenue += (order.amount / 100) || 0;
            meatBreakdown[order.meatType] = (meatBreakdown[order.meatType] || 0) + 1;
            if (order.status === 'delivered') deliveredCount++;
            if (order.status === 'pending') pendingCount++;
          });

          setStats({
            totalOrders: data.length,
            totalRevenue: totalRevenue.toFixed(2),
            deliveredOrders: deliveredCount,
            pendingOrders: pendingCount,
            meatBreakdown,
          });
        }
      })
      .catch(err => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return null;
  if (loading) return <div>📊 Loading analytics...</div>;
  if (error) return <div style={{ color: '#dc3545' }}>{error}</div>;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3 style={{ color: 'white', borderColor: 'white' }}>📊 Order Analytics</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalOrders}</div>
          <div>Total Orders</div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>₹{stats.totalRevenue}</div>
          <div>Total Revenue</div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.deliveredOrders}</div>
          <div>Delivered ✅</div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.pendingOrders}</div>
          <div>Pending ⏳</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '15px',
        borderRadius: '6px',
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ color: 'white' }}>🥩 Meat Breakdown</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {Object.entries(stats.meatBreakdown).map(([meat, count]) => (
            <div key={meat} style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}>
              <strong>{meat}:</strong> {count} orders
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
