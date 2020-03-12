
const Model = require('./model');

module.exports = Model.preparaSchema('estado', {
    nome: { type: String, required: true },
    uf: { type: String, required: true },
});