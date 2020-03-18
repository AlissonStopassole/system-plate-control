
const EstacionamentoModel = require('../models/estacionamento-model');
const ResponseUtils = require('../utils/response-utils');
const VagasOcupadasController = require('../controllers/vagas-ocupadas-controller');

class EstacionamentoController {
    static async getByIdUsuario(_req, res) {
        try {
            log("Get Estacionamentos By Usuario");
            let estacionamento = await EstacionamentoModel.find({ idUsuario: Number(_req.params.id) });
            ResponseUtils.sucesso(res, 0, estacionamento);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(_req, res) {
        try {
            log("Get Estacionamento by id: " + _req.params.id);
            let estacionamento = await EstacionamentoModel.findById(Number(_req.params.id));
            ResponseUtils.sucesso(res, 0, estacionamento);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async salvar(req, res) {
        try {
            if (req.body._id) {
                log("Editar Estacionamento: ", req.body._id);
                await EstacionamentoModel.updateOne(req.body);
                ResponseUtils.sucesso(res, 0, 'Editado com sucesso');
            } else {
                log("Cadastro Estacionamento");
                var retorno = await EstacionamentoModel.create(req.body);
                var retorno2 = await VagasOcupadasController.salvar({ idEstacionamento: retorno._id });
                if (retorno2 !== true) {
                    ResponseUtils.erro(res, retorno2);
                } else {
                    ResponseUtils.sucesso(res, 0, 'Salvo com sucesso');
                }
            }
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = EstacionamentoController;
