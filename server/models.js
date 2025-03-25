const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Card Schema
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Models
const User = mongoose.model('User', userSchema);
const Card = mongoose.model('Card', cardSchema);

// Export both models
module.exports = {
  User,
  Card
};
