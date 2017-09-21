var Client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = Client;

//example
// client.messages.create({
//   from: process.env.FROM,
//   to: process.env.EXAMPLE,
//   body: 'this is a text'
// }).then((message) => console.log(message));