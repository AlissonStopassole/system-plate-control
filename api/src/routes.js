
const express = require('express');
const router = express.Router();
const fs = require('fs');
path = require('path');

const UsuarioController = require('./controllers/usuario-controller');
const EstacionamentoController = require('./controllers/estacionamento-controller');
const EstadoController = require('./controllers/estado-controller');
const CidadeController = require('./controllers/cidade-controller');
const VeiculoController = require('./controllers/veiculo-controller');
const VagasOcupadasController = require('./controllers/vagas-ocupadas-controller');
const VeiculoEstacionamentoController = require('./controllers/veiculo-estacionamento-controller');
const Response = require('./utils/response-utils');

router.get('/usuario/:id', UsuarioController.getById);
router.post('/usuario', UsuarioController.salvar);
router.post('/usuario/auth', UsuarioController.authUser);
router.post('/usuario/email', UsuarioController.getUser);
router.get('/usuario', UsuarioController.get);

router.get('/estacionamento-usuario/:id', EstacionamentoController.getByIdUsuario);
router.get('/estacionamento/:id', EstacionamentoController.getById);
router.post('/estacionamento', EstacionamentoController.salvar);

router.get('/estado/:id', EstadoController.getById);
router.get('/estado', EstadoController.get);

router.get('/cidade/:id', CidadeController.getByIdEstado);
router.get('/cidade', CidadeController.get);

router.get('/veiculo-usuario/:id', VeiculoController.getByIdUsuario);
router.get('/veiculo/:id', VeiculoController.getById);
router.post('/veiculo', VeiculoController.salvar);
router.post('/veiculo/delete', VeiculoController.deletar);

router.get('/new-veicle/:placa/:placaNova', VeiculoEstacionamentoController.newVeicleEstacionamento);
router.get('/get-veicle/:idEstacionamento', VeiculoEstacionamentoController.veicleEstacionamentoGet);

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