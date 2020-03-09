
require('dotenv').config();
require('./utils/log-utils');

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/plate-control', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    log('Mongo OK');
});

app.listen(3000, function () {
    log("Servidor ON");
}); 