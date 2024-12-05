const jwt = require('jsonwebtoken');
const database = require('../database/connection');
const bcrypt = require("bcrypt");


class ClienteController {

    // --------------------------------------------------------------------------

    async novoCliente(request, response) {
        const { nome, email, senha, telefone, endereco } = request.body;

        if (!nome || !email || !senha || !telefone || !endereco) {
            return response.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        try {
            console.log('Recebendo dados:', { nome, email });

            // Gera a hash da senha
            const hash_pass = await bcrypt.hash(senha, 10);
            console.log('Senha criptografada:', hash_pass);

            // Insere no banco de dados
            await database.insert({ nome, email, senha: hash_pass, telefone, endereco }).table('Cliente');
            response.status(201).json({ message: 'Cliente adicionado com sucesso!' });
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error.message, error.stack);
            response.status(500).json({ error: 'Erro ao adicionar cliente.' });
        }
    }

    // --------------------------------------------------------------------------

    async login(request, response) {
        const { email, password } = request.body;
    
        try {
            console.log("Iniciando login para:", email);
    
            // Busca o usuário pelo email
            const user = await database
                .select('*')
                .from('Cliente')
                .where('email', email)
                .first();
    
            console.log("Usuário encontrado:", user);
    
            // Verifica se o usuário existe
            if (!user) {
                console.error("Usuário não encontrado.");
                return response.status(404).json({ error: 'Usuário não encontrado.' });
            }
    
            // Compara a senha fornecida com a armazenada no banco
            const senhaValida = await bcrypt.compare(password, user.senha);
            console.log("Senha válida:", senhaValida);
    
            if (!senhaValida) {
                console.error("Senha inválida.");
                return response.status(400).json({ error: 'Senha inválida.' });
            }
    
            // Função de geração de token (movida para dentro do método de login)
            const gerarToken = (user) => {
                if (!process.env.JWT_SECRET) {
                    throw new Error('Chave secreta não definida!');
                }
                return jwt.sign(
                    { id: user.id_cliente, email: user.email }, // Dados que você deseja incluir no token
                    process.env.JWT_SECRET, // Chave secreta para assinar o token
                    { expiresIn: process.env.JWT_EXPIRES_IN } // Expiração configurada no .env
                );
            };
    
            // Gera o token JWT
            const token = gerarToken(user);  // Agora sem o 'this'
            console.log("Token gerado:", token);
    
            return response.status(200).json({ 
                message: 'Login bem-sucedido!', 
                token: token 
            });
        } catch (error) {
            console.error("Erro no login:", error);
            return response.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
     verifyToken(request, response, next) {
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            return response.status(403).json({ message: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded; // Salva os dados do token no request
            next();
        } catch (error) {
            return response.status(401).json({ message: 'Token inválido ou expirado.' });
        }
    }

    // --------------------------------------------------------------------------
    

    // --------------------------------------------------------------------------
    

    async atualizarCliente(request, response) {
        const { id_cliente } = request.params;
        const { nome, email, senha, telefone, endereco } = request.body;

        if (!id_cliente) {
            return response.status(400).json({ error: 'O ID do cliente é obrigatório.' });
        }

        // Verifica se pelo menos um campo foi enviado para atualização
        if (!nome && !email && !senha && !telefone && !endereco) {
            return response.status(400).json({ error: 'É necessário enviar ao menos um campo para atualizar.' });
        }

        const camposAtualizados = { nome, email, telefone, endereco };

        if (senha) {
            camposAtualizados.senha = await bcrypt.hash(senha, 10); // Criptografa a senha
        }

        try {
            const result = await database('Cliente')
                .where('id_cliente', id_cliente)
                .update(camposAtualizados);

            if (result) {
                response.status(200).json({ message: 'Cliente atualizado com sucesso!' });
            } else {
                response.status(404).json({ error: 'Cliente não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Erro ao atualizar cliente.' });
        }
    }

    // --------------------------------------------------------------------------

    async listarClientes(request, response) {
        try {
            const clientes = await database.select('*').table('Cliente');
            response.status(200).json(clientes); // Retorna a lista de clientes
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Erro ao listar clientes.' });
        }
    }

    // --------------------------------------------------------------------------

    async deletarCliente(request, response) {
        const { id_cliente } = request.params;

        if (!id_cliente) {
            return response.status(400).json({ error: 'O ID do cliente é obrigatório.' });
        }

        try {
            const result = await database('Cliente')
                .where('id_cliente', id_cliente)
                .del();

            if (result) {
                response.status(200).json({ message: 'Cliente deletado com sucesso!' });
            } else {
                response.status(404).json({ error: 'Cliente não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Erro ao deletar cliente.' });
        }
    }
}

module.exports = new ClienteController();