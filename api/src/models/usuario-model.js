
const Model = require('./model');

module.exports = Model.preparaSchema('usuario', {
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, required: true }
});