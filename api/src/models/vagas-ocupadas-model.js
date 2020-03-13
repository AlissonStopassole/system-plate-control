
const Model = require('./model');

module.exports = Model.preparaSchema('vagas-ocupadas', {
    idEstacionamento: { type: Number, required: true },
    qtdVagas: { type: Number, default: 0, required: true },
});