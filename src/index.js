const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const { init } = require('./config/db');
const consumer = require('./consumer/consumer');
// import kafkaRunner from './consumer/consumer';

init().then(() => {
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
  });
  consumer.kafkaRunner();
  // kafkaRunner();
});

module.exports = app;
