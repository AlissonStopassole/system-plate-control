
const Model = require('./model');

module.exports = Model.preparaSchema('cidade', {
    nome: { type: String, required: true },
    idEstado: { type: Number, required: true },
});