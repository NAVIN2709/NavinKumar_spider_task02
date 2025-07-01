const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  photoURL: String,

  // 👇 Add these fields for friend functionality
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // incoming requests
  }],
  sentRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // outgoing requests
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
