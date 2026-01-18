import React from 'react';
import { createOrder } from './api/razorpay';

const RazorpayButton = ({ amount, receipt }) => {
  const handlePayment = async () => {
    const order = await createOrder(amount, receipt);
    const options = {
      key: 'your_razorpay_key_id', // Replace with your Razorpay key
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Optionally, verify payment on backend
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: { color: '#F37254' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay with Razorpay</button>;
};

export default RazorpayButton;
