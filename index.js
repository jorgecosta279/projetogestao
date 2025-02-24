const clienteForm = document.getElementById('clienteForm');
const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
const clienteId = document.getElementById('clienteId');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const btnDownload = document.getElementById('btnDownload');

const apiUrl = 'http://localhost:3000/clientes';

// Carregar clientes do backend
async function carregarClientes() {
    const response = await fetch(apiUrl);
    const clientes = await response.json();
    renderClientes(clientes);
}

function renderClientes(clientes) {
    clientesTable.innerHTML = '';
    clientes.forEach(cliente => {
        const row = clientesTable.insertRow();
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
                <button class="edit" onclick="editarCliente(${cliente.id})">Editar</button>
                <button class="delete" onclick="deletarCliente(${cliente.id})">Excluir</button>
            </td>
        `;
    });
}

clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cliente = {
        nome: nome.value,
        email: email.value,
        telefone: telefone.value
    };

    if (clienteId.value) {
        // Atualizar cliente
        await fetch(`${apiUrl}/${clienteId.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
    } else {
        // Adicionar cliente
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
    }

    resetForm();
    carregarClientes();
});

function resetForm() {
    clienteId.value = '';
    nome.value = '';
    email.value = '';
    telefone.value = '';
}

async function editarCliente(id) {
    const response = await fetch(apiUrl);
    const clientes = await response.json();
    const cliente = clientes.find(c => c.id === id);

    if (cliente) {
        clienteId.value = cliente.id;
        nome.value = cliente.nome;
        email.value = cliente.email;
        telefone.value = cliente.telefone;
    }
}

async function deletarCliente(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    carregarClientes();
}

btnDownload.addEventListener('click', async () => {
    const response = await fetch(apiUrl);
    const clientes = await response.json();

    const jsonBlob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clientes.json';
    link.click();
    URL.revokeObjectURL(url);
});

// Carregar clientes ao abrir a página
carregarClientes();
