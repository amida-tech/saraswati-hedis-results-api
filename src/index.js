const cors = require('cors');
const express = require('express');
const swStats = require('swagger-stats');
const expressWinston = require('express-winston');
const config = require('./config');
const winstonInstance = require('./winston');
const routes = require('./routes/index.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(swStats.getMiddleware({}));

if (config.env === 'development' || config.env === 'production') {
  if (config.logLevel === 'debug') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
  } else {
    expressWinston.requestWhitelist = ['url', 'method', 'httpVersion', 'originalUrl', 'query'];
    expressWinston.responseWhitelist = ['statusCode', 'responseTime'];
  }
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

app.use('/api', routes);

app.listen(config.port, () => {
  winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
    port: config.port,
    node_env: config.env,
  });
});
