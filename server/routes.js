const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Promise = require('bluebird');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('Serving /index.');
});

app.post('/meals', (req, res) => {
  console.log('Receiving data at /meals.');
});

app.get('/meals', (req, res) => {
  console.log('Serving /meals.');
});

app.post('/share', (req, res) => {
  console.log('Receiving data at /share.');
});

app.get('/results', (req, res) => {
  console.log('Serving /results.');
});