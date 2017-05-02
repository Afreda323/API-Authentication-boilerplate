const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Router = require('./routes');
const mongoose = require('mongoose');
//DB Setup
mongoose.connect('mongodb://localhost:27017/reactauth');
const db = mongoose.connection;
//App Setup
const app = express();
app.use(logger('dev'))
app.use(bodyParser.json({type: '*/*'}))

//Server setup
const port = process.env.PORT || 3001;
const server = http.createServer(app);
app.use('/', Router)

server.listen(port, () => {
  console.log('Server listening on Port:' + port);
})
