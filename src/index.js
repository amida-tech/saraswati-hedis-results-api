const cors = require('cors');
const express = require('express');
const config = require('./config');
const routes = require('./routes/index.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', routes);

app.listen(config.port, () => {
  console.log(`App listening at ${config.host}:${config.port}`)
});