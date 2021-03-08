const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const { init } = require('./config/db')


init().then(() => {
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
  });
})

module.exports = app;
