
var express = require('express');
var cors = require('cors');
var consign = require('consign');
var routes = require('./routes.js');

var app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

consign()
    .then('src/schedules')
    .into(app);

module.exports = app;