
const { Schema, model } = require('mongoose');
const ContadorModel = require('./contador-model');

module.exports.preparaSchema = (name, schemaParam) => {
    const _schema = Object.assign(schemaParam, { _id: Number });
    const options = { versionKey: false, timestamps: true, collection: name };
    const entitySchema = new Schema(_schema, options);

    entitySchema.pre('save', async function (next) {
        this._id = !this._id ? await ContadorModel.getContador(name) : this._id;
        next();
    });

    return model(name, entitySchema);
};