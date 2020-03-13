
const VagasOcupadasModel = require('../models/vagas-ocupadas-model');
const ResponseUtils = require('../utils/response-utils');

class VagasOcupadasController {
    static async getByIdEstacionamento(_req, res) {
        try {
            log("Get Vagas By Estacionamento");
            let vagas = await VagasOcupadasController.findByIdEstacionamento(Number(_req.params.id));

            ResponseUtils.sucesso(res, vagas);
        } catch (error) {
            console.log(error);

            ResponseUtils.erro(res, error);
        }
    }

    static async findByIdEstacionamento(id) {
        return await VagasOcupadasModel.find({ idEstacionamento: id });
    }

    static async salvar(data) {
        try {
            if (data._id) {
                var query = { _id: data._id };
                await VagasOcupadasModel.update(query, data);
                log("Editar Contador Vagas Ocupadas: " + data._id);
                return true;
            } else {
                await VagasOcupadasModel.create(data);
                log("Cadastro Contador Vagas Ocupadas: " + data.idEstacionamento);
                return true;
            }
        } catch (error) {
            return error;
        }
    }

}

module.exports = VagasOcupadasController;
