// const mqtt = require('mqtt');
// const client = mqtt.connect('mqtt://iot.leigado.com.br');
// const TemperaturaController = require('./temperatura-controller');
// const UmidadeController = require('./umidade-controller');
// const DeviceModel = require('../models/device-model');
// const cluster = require('cluster');

// class MqttController {
//     static connect() {
//         client.on('connect', async () => {
//             var project = {
//                 chave: 1,
//             }
//             var options = {};
//             var devices = await DeviceModel.find({ ativo: true }, project, options);

//             if (process.env.NODE_APP_INSTANCE == '0' || cluster.isMaster) {
//                 devices.map(device => {
//                     client.subscribe(['umidade_node/' + device.chave, 'temperatura_node/' + device.chave], () => { });
//                 })

//                 client.on('message', async (topic, message) => {
//                     var chaveDevice = topic.split('/')[1];
//                     var topicType = topic.split('/')[0];
//                     if (topicType === 'temperatura_node') {
//                         log("Salvar Temperatura -> Inicio", chaveDevice, message.toString());
//                         TemperaturaController.salvar(chaveDevice, message.toString());
//                         log("Salvar Temperatura -> Fim");
//                     }
//                     if (topicType === 'umidade_node') {
//                         log("Salvar Umidade -> Inicio", chaveDevice, message.toString());
//                         UmidadeController.salvar(chaveDevice, message.toString());
//                         log("Salvar Umidade -> Fim");
//                     }
//                 });
//             };
//         });
//     }
// }

// module.exports = MqttController;
