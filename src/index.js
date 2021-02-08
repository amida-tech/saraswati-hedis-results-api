const config = require('./config');
const winstonInstance = require('./winston');
const app = require('./express.js');
/* eslint-disable no-unused-vars */
const db = require('./sequelize');


app.listen(config.port, () => {
  winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
    port: config.port,
    node_env: config.env,
  });
});



module.exports = app;