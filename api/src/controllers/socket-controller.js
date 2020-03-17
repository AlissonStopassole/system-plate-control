cliente = null;

class SocketController {
    static connect(io) {
        cliente = io.on('connection', function (socket) {
            log("Socket ON");

            socket.on('disconnect', function () {
                log('Socket OFF');
            });
        });
    }

    static emit() {
        log("Emit");
        cliente.emit('new-message', "1");
    }
}

module.exports = SocketController;