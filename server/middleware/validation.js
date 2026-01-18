// Input validation middleware

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check if all fields exist
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  // Validate name (at least 2 characters)
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password (at least 6 characters)
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

const validateOrder = (req, res, next) => {
  const { meatType, weight, quantity } = req.body;
  
  const validMeatTypes = ['Chicken', 'Mutton', 'Beef', 'Fish'];
  
  if (!meatType || !validMeatTypes.includes(meatType)) {
    return res.status(400).json({ error: `Invalid meat type. Must be one of: ${validMeatTypes.join(', ')}` });
  }
  
  if (!weight || weight <= 0 || typeof weight !== 'number') {
    return res.status(400).json({ error: 'Weight must be a positive number' });
  }
  
  if (!quantity || quantity <= 0 || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Quantity must be a positive number' });
  }
  
  next();
};

const validateOrderUpdate = (req, res, next) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateOrder,
  validateOrderUpdate,
};
