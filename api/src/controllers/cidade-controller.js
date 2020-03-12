
const CidadeModel = require('../models/cidade-model');
const ResponseUtils = require('../utils/response-utils');

class CidadeController {
    static async get(_req, res) {
        try {
            log("Get All Cidade");
            let cidades = await CidadeModel.find();
            ResponseUtils.sucesso(res, cidades);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getByIdEstado(_req, res) {
        try {
            log("Get Cidade by idEstado: " + _req.params.id);
            let cidade = await CidadeModel.find({ idEstado: Number(_req.params.id) });
            ResponseUtils.sucesso(res, cidade);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(id) {
        try {
            log("Get Cidade by id: " + id);
            let cidade = await CidadeModel.findById(id);
            return cidade;
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = CidadeController;
