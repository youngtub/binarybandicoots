console.log('accountsid', process.env.TWILIO_ACCOUNT_SID)

exports.twilioUser = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendTextWithEventInfo = (recipient, eventID) => {
  return exports.twilioUser.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/meal?' + eventID
  });
};

exports.sendTextWithHistory = (recipient, acctID) => {
  return exports.twilioUser.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + process.env.HOST + ':' + process.env.PORT + '/#!/account?' + acctID
  });
};