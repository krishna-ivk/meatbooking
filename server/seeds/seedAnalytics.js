/*
  Idempotent seed script for Analytics mock data.
  - Creates 3 users (including 1 admin) if they don't exist
  - Creates orders for those users spanning last 90 days
  - Will not duplicate orders if run multiple times (checks existing marker)

  Run: node server/seeds/seedAnalytics.js
*/

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

const MEAT_TYPES = ['Chicken', 'Mutton', 'Beef', 'Fish'];
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createUsers() {
  const users = [
    { name: 'Alice Kumar', email: 'alice@example.com', password: 'password123', isAdmin: false },
    { name: 'Bob Sharma', email: 'bob@example.com', password: 'password123', isAdmin: false },
    { name: 'Admin User', email: 'admin@example.com', password: 'AdminPass123', isAdmin: true },
  ];

  const created = [];
  for (const u of users) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      const hashed = await bcrypt.hash(u.password, 10);
      user = await User.create({ name: u.name, email: u.email, password: hashed, isAdmin: !!u.isAdmin });
      created.push(user.email);
    }
  }
  return created;
}

async function seedOrders() {
  // Use a marker to avoid duplicating massive data on repeated runs
  const seedMarker = await Order.findOne({ 'meta.seededBy': 'seedAnalytics_v1' });
  if (seedMarker) {
    console.log('Seed marker found — orders already seeded. Exiting.');
    return { inserted: 0 };
  }

  const users = await User.find({ email: { $in: ['alice@example.com', 'bob@example.com', 'admin@example.com'] } });
  if (!users.length) throw new Error('Required users not found — run createUsers first');

  const orders = [];
  const now = Date.now();
  const daysBack = 90;
  const totalOrders = 120; // realistic dataset

  for (let i = 0; i < totalOrders; i++) {
    const user = users[i % users.length];
    const meatType = randomFrom(MEAT_TYPES);
    const weight = randomFloat(0.25, 5, 2); // kg
    const quantity = randomInt(1, 5);
    const pricePerKg = { Chicken: 300, Mutton: 600, Beef: 500, Fish: 400 }[meatType] || 300;
    const amountINR = Math.round(pricePerKg * weight * quantity * 100); // paise

    // spread orders across last `daysBack` days
    const ts = new Date(now - randomInt(0, daysBack * 24 * 60 * 60 * 1000));

    const statusWeights = {
      pending: 0.10,
      confirmed: 0.20,
      shipped: 0.25,
      delivered: 0.40,
      cancelled: 0.05,
    };
    // pick status by weighted probability
    const r = Math.random();
    let cumulative = 0;
    let status = 'pending';
    for (const s of Object.keys(statusWeights)) {
      cumulative += statusWeights[s];
      if (r <= cumulative) {
        status = s;
        break;
      }
    }

    const order = {
      user: user._id,
      meatType,
      weight,
      quantity,
      amount: amountINR,
      paymentId: `pay_mock_${i}_${Date.now().toString(36)}`,
      status,
      createdAt: ts,
      meta: { seededBy: 'seedAnalytics_v1' },
    };
    orders.push(order);
  }

  const res = await Order.insertMany(orders);
  return { inserted: res.length };
}

async function main() {
  try {
    await connectDB();
    console.log('Creating users (if missing)...');
    const usersCreated = await createUsers();
    if (usersCreated.length) console.log('Created users:', usersCreated);
    else console.log('Users already exist.');

    console.log('Seeding orders for analytics...');
    const { inserted } = await seedOrders();
    console.log(`Inserted ${inserted} orders.`);

    console.log('Done — analytics mock data is ready.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
