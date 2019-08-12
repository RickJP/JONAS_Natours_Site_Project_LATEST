const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    trim: true,
    required: [true, 'A password is required.'],
    minlength: 6
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE & SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;