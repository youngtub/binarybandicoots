const server = require('./routes.js');

server.listen(process.env.PORT, () => {
  console.log('Server listening on port 3000');
});