const connection = require('../database/connection')
const express = require('express')
const router = express.Router()
const ClienteController = require('../controllers/ClienteController')
const ServicoController = require('../controllers/ServicoController');

// rotas clientes
router.post('/novoCliente', ClienteController.novoCliente)
router.get('/listarClientes', ClienteController.listarClientes)
router.delete('/deletarCliente/:id_cliente', ClienteController.deletarCliente);
router.put('/atualizarCliente/:id_cliente', ClienteController.atualizarCliente);
router.post('/login', ClienteController.login)
router.get('/protected-route', ClienteController.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Acesso autorizado à rota protegida.' });
});
// rotas serviços
router.post('/novoServico', ServicoController.novoServico);
router.get('/listarServicos', ServicoController.listarServicos);
router.put('/atualizarServico/:id_servico', ServicoController.atualizarServico);
router.delete('/deletarServico/:id_servico', ServicoController.deletarServico);

module.exports = router