
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

    // static async autenticar(req, res) {
    //     log("Autenticar -> Inicio", req.body.email);
    //     try {
    //         let usuario = await UsuarioModel.findOne({ email: req.body.email.toLowerCase().trim() });
    //         if (usuario) {
    //             if (usuario.get('senha') === CriptoUtils.criptografar(req.body.senha) || usuario.get('senha') === req.body.senha) {
    //                 var retorno = { usuario: usuario, devices: [] };
    //                 let usuarioDevice = await UsuarioDeviceModel.findById(usuario._id);
    //                 if (usuarioDevice && usuarioDevice.devices.length) {
    //                     for (let i = 0; i < usuarioDevice.devices.length; i++) {
    //                         let device = await DeviceModel.findById(usuarioDevice.devices[i]);
    //                         retorno.devices.push({ _id: device._id, nome: device.nome, chave: device.chave });
    //                     }
    //                 }
    //                 ResponseUtils.sucesso(res, retorno);
    //             } else {
    //                 ResponseUtils.falha(res, 'O e-mail ou senha informados estão incorretos, verifique seus dados de acesso e tente novamente.');
    //             }
    //         } else {
    //             ResponseUtils.falha(res, 'O e-mail ou senha informados estão incorretos, verifique seus dados de acesso e tente novamente.');
    //         }
    //     } catch (error) {
    //         ResponseUtils.erro(res, error);
    //     } finally {
    //         log("Autenticar -> Fim")
    //     }
    // }

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
