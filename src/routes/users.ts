import * as answer from '../routes/answers'
import { auth } from '../middleware/auth';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User, validateUser as validate } from '../models/user';
import express from 'express';
export const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req['user']['_id']).select('-password');
    res.send(user);
  } catch (error) {
    console.log(error);
    answer.notFound(res);
  }
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
  const salt = await bcrypt.genSalt(10);
  user['password']  = await bcrypt.hash(user['password'], salt);

  try {
    await user.save();
    const token = user['generateAuthToken']();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));  
  } catch (error) {
    console.log(error.message);
  }
});