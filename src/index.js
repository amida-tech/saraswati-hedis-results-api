const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
/* eslint-disable no-unused-vars */
const db = require('./config/sequelize');

app.listen(config.port, () => {
  winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
    port: config.port,
    node_env: config.env,
  });
});

module.exports = app;
