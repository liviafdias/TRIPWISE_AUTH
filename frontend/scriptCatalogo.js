function adicionarAoCarrinho(nome, descricao, preco) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ nome, descricao, preco });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${nome} foi adicionado ao carrinho!`);
}

async function carregarPasseios() {
    try {
        const response = await fetch('http://localhost:4000/listarServicos');
        const passeios = await response.json();

        const container = document.getElementById('passeios-container');
        passeios.forEach(passeio => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">${passeio.nome}</h5>
                        <p class="card-text">${passeio.descricao}</p>
                        <p class="card-text"><strong>R$ ${passeio.preco}</strong></p>
                        <a href="#" class="btn btn-primary" onclick="adicionarAoCarrinho('${passeio.nome}', '${passeio.descricao}', ${passeio.preco})">Adicionar ao Carrinho</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar os passeios:', error);
    }
}

document.addEventListener('DOMContentLoaded', carregarPasseios);