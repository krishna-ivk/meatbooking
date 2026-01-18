import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyle = () => {
    const base = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease',
      maxWidth: '400px',
    };

    const typeStyles = {
      success: {
        ...base,
        background: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
      },
      error: {
        ...base,
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
      },
      info: {
        ...base,
        background: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb',
      },
      warning: {
        ...base,
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
      },
    };

    return typeStyles[type] || typeStyles.info;
  };

  return (
    <div style={getStyle()}>
      {type === 'success' && '✅ '}
      {type === 'error' && '❌ '}
      {type === 'warning' && '⚠️ '}
      {type === 'info' && 'ℹ️ '}
      {message}
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const show = (message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
};

export default Toast;
