
const VeiculoModel = require('../models/veiculo-model');
const ResponseUtils = require('../utils/response-utils');
var socket = require('../controllers/socket-controller');
class VeiculoController {
    static async getByIdUsuario(_req, res) {
        try {
            log("Get Veiculos By Usuario");
            socket.emit("Teste");
            var veiculos = await VeiculoModel.find({ idUsuario: Number(_req.params.id) });
            ResponseUtils.sucesso(res, 0, veiculos);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(_req, res) {
        try {
            log("Get Veiculo by id: " + _req.params.id);
            let veiculo = await VeiculoModel.findById(Number(_req.params.id));
            ResponseUtils.sucesso(res, 0, veiculo);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async salvar(req, res) {
        try {
            let veiculo = await VeiculoModel.findOne({ numeroPlaca: req.body.numeroPlaca });
            if (!veiculo || (veiculo && veiculo._id === req.body._id)) {
                if (req.body._id) {
                    var query = { _id: req.body._id };
                    await VeiculoModel.update(query, req.body);
                    log("Editar Veiculo: " + req.body._id);
                    ResponseUtils.sucesso(res, 0, 'Editado com sucesso');
                } else {
                    await VeiculoModel.create(req.body);
                    log("Cadastro Veiculo: " + req.body.numeroPlaca);
                    ResponseUtils.sucesso(res, 0, 'Salvo com sucesso');
                }
            } else {
                log("Veículo já cadastrado: " + req.body.numeroPlaca);
                ResponseUtils.erro(res, 'Veículo já cadastrado');
            }
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async deletar(req, res) {
        try {
            await VeiculoModel.deleteOne(req.body);
            log("Excluir Veículo: " + req.body.numeroPlaca);
            ResponseUtils.sucesso(res, 0, 'Deletado com sucesso');
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = VeiculoController;
