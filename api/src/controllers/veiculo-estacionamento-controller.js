
const VeiculoModel = require('../models/veiculo-model');
const VeiculoEstacionamentoModel = require('../models/veiculo-estacionamento-model');
const ResponseUtils = require('../utils/response-utils');
var socket = require('../controllers/socket-controller');
class VeiculoEstacionamentoController {
    static async newVeicleEstacionamento(_req, res) {
        try {
            console.log(_req.params.placa);
            var veiculos = await VeiculoModel.find({ numeroPlaca: _req.params.placa });
            if (veiculos && veiculos[0]) {
                socket.emit('1');
                console.log(veiculos[0]._id);

                var veiculosEstacionamento = await VeiculoEstacionamentoModel.find({ idVeiculo: veiculos[0]._id });
                console.log(veiculosEstacionamento);

                if (!veiculosEstacionamento || !veiculosEstacionamento.length) {
                    var newVE = VeiculoEstacionamentoModel({
                        idVeiculo: veiculos[0]._id,
                        idEstacionamento: 1,
                    });
                    await VeiculoEstacionamentoModel.create(newVE);
                } else {
                    await VeiculoEstacionamentoModel.findOneAndRemove({ idVeiculo: veiculos[0]._id });
                }
            } else {
                socket.emit(_req.params.placa);
            }
            ResponseUtils.sucesso(res, 0);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async veicleEstacionamentoGet(_req, res) {
        try {
            var veiculosEstacionamento = await VeiculoEstacionamentoModel.find({ idEstacionamento: Number(_req.params.idEstacionamento) });
            var veiculos = [];

            for (let i = 0; i < veiculosEstacionamento.length; i++) {
                const element = veiculosEstacionamento[i];
                var v = await VeiculoModel.findById(element.idVeiculo);
                veiculos.push(v);
            }

            ResponseUtils.sucesso(res, 0, veiculos);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

}

module.exports = VeiculoEstacionamentoController;
