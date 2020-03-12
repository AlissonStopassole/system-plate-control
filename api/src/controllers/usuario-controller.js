
const UsuarioModel = require('../models/usuario-model');
const ResponseUtils = require('../utils/response-utils');

class UsuarioController {
    static async get(_req, res) {
        try {
            log("Get All Usuários");
            let usuarios = await UsuarioModel.find();
            ResponseUtils.sucesso(res, usuarios);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async getById(_req, res) {
        try {
            log("Get Usuário by id: " + _req.params.id);
            let usuario = await UsuarioModel.findById(Number(_req.params.id));
            ResponseUtils.sucesso(res, usuario);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async salvar(req, res) {
        try {
            let usuario = await UsuarioModel.findOne({ email: req.body.email });
            if (!usuario) {
                await UsuarioModel.create(req.body);
                log("Cadastro Usuário: " + req.body.email);
                ResponseUtils.sucesso(res, 'Salvo com sucesso');
            } else {
                log("E-mail já cadastrado: " + req.body.email);
                ResponseUtils.falha(res, 'E-mail já cadastrado');
            }
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = UsuarioController;
