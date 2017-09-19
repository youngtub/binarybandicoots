const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('Welcome to Index!');
});