
const EstacionamentoModel = require('../models/estacionamento-model');
const ResponseUtils = require('../utils/response-utils');

class EstacionamentoController {
    static async get(_req, res) {
        try {
            log("Get All Estacionamentos");
            let estacionamento = await EstacionamentoModel.find();
            ResponseUtils.sucesso(res, estacionamento);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(_req, res) {
        try {
            log("Get Estacionamento by id: " + _req.params.id);
            let estacionamento = await EstacionamentoModel.findById(Number(_req.params.id));
            ResponseUtils.sucesso(res, estacionamento);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async salvar(req, res) {
        try {
            if (req.body._id) {
                await EstacionamentoModel.update(req.body);
            } else {
                await EstacionamentoModel.create(req.body);
            }
            log("Cadastro Estacionamento: " + req.body);
            ResponseUtils.sucesso(res, 'Salvo com sucesso');
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = EstacionamentoController;
