

  
document.getElementById("cadastrarBtn").addEventListener("click", async function (event) {
    event.preventDefault(); 
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("registerConfirmPassword");
    const telefoneInput = document.getElementById("registerTelefone");
    const enderecoInput = document.getElementById("registerEndereco");


    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.classList.remove("is-invalid");
    });

    try {
        if (!nameInput.value.trim()) {
            throw { input: nameInput, message: "Por favor, preencha o nome completo." };
        }

        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
            throw { input: emailInput, message: "Por favor, insira um email válido." };
        }

        if (!passwordInput.value.trim()) {
            throw { input: passwordInput, message: "Por favor, preencha a senha." };
        }

        if (!confirmPasswordInput.value.trim() || passwordInput.value !== confirmPasswordInput.value) {
            throw { input: confirmPasswordInput, message: "As senhas não coincidem." };
        }

        const dadosUsuario = {
            nome: nameInput.value.trim(),
            email: emailInput.value.trim(),
            senha: passwordInput.value,
            telefone: telefoneInput.value.trim(),
            endereco: enderecoInput.value.trim()
        };

        console.log("Dados do usuário:", dadosUsuario);

        const response = await fetch('http://localhost:4000/novoCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuário cadastrado com sucesso:', data);
            alert('Cadastro bem-sucedido!');
        } else {
            const errorData = await response.json();
            console.error('Erro no cadastro:', errorData);
            alert(errorData.message || 'Erro no cadastro');
        }
    } catch (error) {
        if (error.input) {
            // Adiciona a classe 'is-invalid' para destacar o campo com erro
            error.input.classList.add("is-invalid");
        } else {
            console.error("Erro inesperado:", error);
            alert("Erro inesperado. Verifique o console.");
        }
    }
});
document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // Remove qualquer classe de erro anterior
    [emailInput, passwordInput].forEach(input => input.classList.remove("is-invalid"));

    try {
        // Validação dos campos de entrada
        if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
            throw { input: emailInput, message: "Por favor, insira um email válido." };
        }

        if (!passwordInput.value.trim()) {
            throw { input: passwordInput, message: "Por favor, insira a senha." };
        }

        // Dados para o login
        const dataLogin = {
            email:  emailInput.value,
            password: passwordInput.value,
        };

        // Requisição ao servidor
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataLogin),
        });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao autenticar. Tente novamente.');
        }

        const data = await response.json();

        // Verifica se o token foi retornado corretamente
        if (!data.token) {
            throw new Error('Token não encontrado na resposta.');
        }

        // Salva o token no localStorage
        localStorage.setItem('authToken', data.token);

        window.location.href = 'catalogo.html';

        
        // Requisição para rota protegida usando o token
        const token = localStorage.getItem('authToken');
        const protectedResponse = await fetch('http://localhost:4000/protected-route', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        // Verifica se a resposta da rota protegida é válida
        if (!protectedResponse.ok) {
            throw new Error('Erro ao acessar a rota protegida. Acesso negado.');
        }
        
        const protectedData = await protectedResponse.json();
        console.log('Dados protegidos:', protectedData);
        
    } catch (error) {
        // Se houver erro de validação nos campos
        if (error.input) {
            // Adiciona a classe de erro ao campo inválido
            error.input.classList.add("is-invalid");
        } else {
            // Caso um erro inesperado ocorra, exibe uma mensagem de erro
            console.error('Erro inesperado:', error);
            alert(error.message || "Erro inesperado. Verifique o console.");
        }
    }
    
    async function validateSession() {
        const token = localStorage.getItem('authToken');
        if (!token) return false;
    
        const response = await fetch('http://localhost:4000/auth/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    
        if (response.ok) {
            const userData = await response.json();
            return userData; // Retorna informações do usuário
        } else {
            localStorage.removeItem('authToken');
            return false; // Sessão inválida
        }
    }

    async function protectRoute() {
        const user = await validateSession();
        if (!user) {
            window.location.href = 'login.html';
        }
    }
    
    // Execute ao carregar a página
    protectRoute();
    
    
});




