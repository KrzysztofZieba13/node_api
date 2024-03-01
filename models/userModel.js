const mongoose = require('mongoose');
const validator = require('validator');

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
    unique: true,
  },
  photo: String,
  password: { type: String, required: true, minlength: 8 },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
