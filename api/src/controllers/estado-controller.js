
const EstadoModel = require('../models/estado-model');
const ResponseUtils = require('../utils/response-utils');

class EstadoController {
    static async get(_req, res) {
        try {
            log("Get All Estados");
            let estados = await EstadoModel.find();
            ResponseUtils.sucesso(res, estados);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(_req, res) {
        try {
            let estado = await this.findById(Number(_req.params.id));
            ResponseUtils.sucesso(res, estado);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async findById(id) {
        log("Get Estado by id: " + id);
        return await EstadoModel.findById(Number(id));
    }
}

module.exports = EstadoController;
