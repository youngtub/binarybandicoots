var url = process.env.FULL || process.env.HOST + ':' + process.env.PORT

console.log('host url', url);


exports.twilioUser = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendTextWithEventInfo = (recipient, eventID) => {
  return exports.twilioUser.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + url + '/#!/meal?' + eventID
  });
};

exports.sendTextWithHistory = (recipient, acctID) => {
  return exports.twilioUser.messages.create({
    from: process.env.FROM,
    to: recipient,
    body: 'http://' + url + '/#!/account?' + acctID
  });
};