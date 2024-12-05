let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const lista = document.getElementById('carrinho-lista');

carrinho.forEach((item, index) => {
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `${item.nome} - ${item.descricao} - <strong>R$ ${item.preco}</strong>
                    <button class="btn btn-sm btn-danger float-end" onclick="removerItem(${index})">Remover</button>`;
    lista.appendChild(li);
});

function removerItem(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload();
}

function finalizarCompra() {
    alert('Compra finalizada com sucesso!');
    limparCarrinho();
}
