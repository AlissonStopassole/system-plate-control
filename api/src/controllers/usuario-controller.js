
const UsuarioModel = require('../models/usuario-model');
const ResponseUtils = require('../utils/response-utils');
const Admin = require('firebase-admin');
const serviceAccount = require("../../platecontrol-ee1d8-firebase-adminsdk-ms49z-afe18263cb.json");

Admin.initializeApp({
    credential: Admin.credential.cert(serviceAccount),
    databaseURL: "https://platecontrol-ee1d8.firebaseio.com"
});

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
                if (!req.body._id) {
                    log("E-mail já cadastrado: " + req.body.email);
                    ResponseUtils.falha(res, 'E-mail já cadastrado');
                } else {
                    var query = { _id: req.body._id };
                    await UsuarioModel.update(query, req.body);
                    log("Editar Usuario: " + req.body._id);
                    ResponseUtils.sucesso(res, 'Editado com sucesso');
                }
            }

        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }

    static async authUser(req, res) {
        try {
            Admin.auth().verifyIdToken(req.body.token)
                .then(function (decodedToken) {
                    if (new Date(decodedToken.exp * 1000) < new Date()) {
                        ResponseUtils.sucesso(res, false);
                    } else {
                        ResponseUtils.sucesso(res, true);
                    }
                }).catch(function (error) {
                    ResponseUtils.sucesso(res, false);
                });
        } catch (error) {
            ResponseUtils.sucesso(res, false);
        }
    }

    static async getUser(_req, res) {
        try {
            log("Get Usuário By Email: ", _req.body.email);
            let usuario = await UsuarioModel.find({ email: _req.body.email });
            ResponseUtils.sucesso(res, usuario);
        } catch (error) {
            ResponseUtils.erro(res, error);
        }
    }
}

module.exports = UsuarioController;
