var Client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

Client.sendTextWithEventInfo = (recipient, eventID) => {
  return Client.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/meal?' + currentEventID
  });
}

Client.sendTextWithHistory = (recipient, acctID) => {
  return Client.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/account?' + acctId
  });
}

module.exports = Client;