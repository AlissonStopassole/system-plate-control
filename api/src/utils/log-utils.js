
const SimpleNodeLoger = require('simple-node-logger');
let opts = {
    errorEventName: 'error',
    logDirectory: './logs/',
    fileNamePattern: '<DATE>.log',
    dateFormat: 'YYYY-MM-DD'
};

let snl = SimpleNodeLoger.createRollingFileLogger(opts);

global.log = (...info) => {
    info.forEach(i => {
        snl.info(i);
    });
};

global.logRotas = () => {
    return (req, res, next) => {
        var oldSend = res.send;
        let ini = new Date().getTime();
        res.send = function (data) {
            let tempo = (new Date().getTime() - ini) + 'ms';
            log(req.method + ': ' + req.url + ' ' + tempo);
            oldSend.apply(res, [data]);
        }
        next();
    };
}

process.on('uncaughtException', err => {
    log((err && err.stack) ? err.stack : err);
});
