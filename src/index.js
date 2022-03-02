const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const { init } = require('./config/dao');
const consumer = require('./consumer/consumer');

init().then(() => {
  consumer.kafkaRunner();
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
  });
});

module.exports = app;
