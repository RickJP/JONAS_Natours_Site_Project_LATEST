const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: [true, 'A username is required.'],
    unique: true,
    trim: true,
    minlength: [6, 'A username must contain 6 or more charcaters'],
    maxlength: [30, 'A username must contain 30 characters or less']
  },
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A password is required.'],
    unique: true,
    trim: true,
    minlength: [6, 'A password must contain 6 or more characters'],
    maxlength: [30, 'A password must contain 30 characters or less']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password']
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;