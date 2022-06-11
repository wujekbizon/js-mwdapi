const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successfull!'))
  .catch((err) => console.log(err));

app.use(express.json());

app.listen(5000, (req, res) => {
  console.log('Listening on Port 5000');
});
