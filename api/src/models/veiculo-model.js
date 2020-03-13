
const Model = require('./model');

module.exports = Model.preparaSchema('veiculo', {
    idUsuario: { type: Number, required: true },
    modelo: { type: String, required: true },
    ano: { type: Number, required: true },
    cor: { type: String, required: true },
    cidade: { type: Number, required: false },
    estado: { type: Number, required: false },
    placaNova: { type: Boolean, required: true },
    numeroPlaca: { type: String, required: true }
});