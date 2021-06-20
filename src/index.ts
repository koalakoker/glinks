import cors from 'cors';
import express from 'express';
import Debug from "debug";
import mongoose from 'mongoose';

import { router as links  } from './links';
import { router as config } from './config';

const debug = Debug("MyApp");
const PORT = process.env.PORT || 5000
const app = express();

mongoose.connect('mongodb://localhost:27017/Links', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected with db...");
  })
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello, please use the API");
});

app.use('/api/links', links);
app.use('/api/config', config);

app.listen(PORT, () => {
  console.log("Starting glink server...");
  console.log(`Listening on ${PORT}`)
});