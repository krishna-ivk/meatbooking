// Razorpay payment API for React frontend
export const createOrder = async (amount, receipt) => {
  const response = await fetch('http://localhost:5000/api/payment/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, receipt }),
  });
  return response.json();
};
