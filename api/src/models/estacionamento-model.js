
const Model = require('./model');

module.exports = Model.preparaSchema('estacionamento', {
    nome: { type: String, required: true },
    qtdVagas: { type: Number, required: true },
    precoVaga: { type: Number, required: true }
});