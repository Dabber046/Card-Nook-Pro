const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Card = require('./models/Card');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password: hash });
  res.json(user);
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.sendStatus(403);
  }
};

app.get('/api/cards', authenticate, async (req, res) => {
  const cards = await Card.find({ userId: req.user._id });
  res.json(cards);
});

app.post('/api/cards', authenticate, async (req, res) => {
  const card = await Card.create({ name: req.body.name, userId: req.user._id });
  res.json(card);
});

app.get('/api/price/:name', async (req, res) => {
  const price = (Math.random() * 100).toFixed(2);
  res.json({ price });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));