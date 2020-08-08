
require('dotenv').config();
require('./utils/log-utils');

var app = require('./app');
var http = require('http');
var server = http.Server(app);
var mongoose = require('mongoose');
var io = require('socket.io');

var socket = require('./controllers/socket-controller');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/plate-control', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    log('Mongo ON');
});

server.listen(3000, function () {
    log("Servidor ON");
});

io = io.listen(server);
socket.connect(io);