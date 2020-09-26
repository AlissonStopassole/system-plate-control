
const Model = require('./model');

module.exports = Model.preparaSchema('veiculo-estacionamento', {
    idVeiculo: { type: Number, required: true },
    idEstacionamento: { type: Number, required: true },
});