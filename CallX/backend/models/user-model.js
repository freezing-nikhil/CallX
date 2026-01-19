const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    phone: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => (avatar ? `http://localhost:5500${avatar}` : avatar),
    },
    activated: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);
userSchema.path('phone').validate(function (value) {
  if (!value && !this.email) {
    return false; 
  }
  return true;
}, 'Either phone or email must be provided');

userSchema.path('email').validate(function (value) {
  if (!value && !this.phone) {
    return false;
  }
  return true;
}, 'Either phone or email must be provided');

module.exports = mongoose.model('User', userSchema, 'users');

