const mongoose = require('mongoose');

const ContadorSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, required: true }
}, { collection: 'contador', versionKey: false });

ContadorSchema.statics.getContador = async function (name) {
    var result = await this.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { upsert: true, new: true });
    return result.seq;
}

module.exports = mongoose.model('contador', ContadorSchema);;