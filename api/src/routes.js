
const express = require('express');
const router = express.Router();
const fs = require('fs');
path = require('path');

const UsuarioController = require('./controllers/usuario-controller');
const EstacionamentoController = require('./controllers/estacionamento-controller');
const Response = require('./utils/response-utils');

router.get('/usuario/:id', UsuarioController.getById);
router.post('/usuario', UsuarioController.salvar);
router.get('/usuario', UsuarioController.get);

router.get('/estacionamento/:id', EstacionamentoController.getById);
router.post('/estacionamento', EstacionamentoController.salvar);
router.get('/estacionamento', EstacionamentoController.get);

router.get('/log/:data', async (req, res) => {
    try {
        var filePath = path.join(__dirname, '../logs/' + req.params.data + '.log');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                Response.erro(res, "Arquivo não existe");
            };
            res.end(data);
        });
    } catch (error) {
        Response.erro(res, error);
    }

});

module.exports = router; 