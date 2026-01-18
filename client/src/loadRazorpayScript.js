// Add this in your index.html or load dynamically in your main App component
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// Or, in React, dynamically load the script:
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
