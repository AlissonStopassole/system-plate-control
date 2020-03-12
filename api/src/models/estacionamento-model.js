
const Model = require('./model');

module.exports = Model.preparaSchema('estacionamento', {
    idUsuario: { type: Number, required: true },
    nome: { type: String, required: true },
    qtdVagas: { type: Number, required: true },
    precoVaga: { type: Number, required: true }
});