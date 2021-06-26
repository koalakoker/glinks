import config from 'config';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this['_id'], isAdmin: this['isAdmin'] }, config.get('jwtPrivateKey'));
}

export const User = mongoose.model('User', userSchema);

export function validateUser(user) {
  const schema = Joi.object({
    name    : Joi.string().min(5).max(50) .required(),
    email   : Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin : Joi.boolean().required()
  });

  return schema.validate(user);
}