let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
const clienteForm = document.getElementById('clienteForm');
const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
const clienteId = document.getElementById('clienteId');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const btnDownload = document.getElementById('btnDownload'); // Botão para baixar o arquivo JSON

clienteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cliente = {
    id: clienteId.value || Date.now(),
    nome: nome.value,
    email: email.value,
    telefone: telefone.value
  };

  if (clienteId.value) {
    // Editar cliente
    clientes = clientes.map(c => c.id === cliente.id ? cliente : c);
  } else {
    // Adicionar novo cliente
    clientes.push(cliente);
  }

  // Salvar no localStorage em formato JSON
  localStorage.setItem('clientes', JSON.stringify(clientes));

  resetForm();
  renderClientes();
});

function resetForm() {
  clienteId.value = '';
  nome.value = '';
  email.value = '';
  telefone.value = '';
}

function renderClientes() {
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

function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (cliente) {
    clienteId.value = cliente.id;
    nome.value = cliente.nome;
    email.value = cliente.email;
    telefone.value = cliente.telefone;
  }
}

function deletarCliente(id) {
  clientes = clientes.filter(cliente => cliente.id !== id);
  // Atualizar o localStorage após exclusão
  localStorage.setItem('clientes', JSON.stringify(clientes));
  renderClientes();
}

// Função para baixar o arquivo JSON
btnDownload.addEventListener('click', () => {
  const jsonBlob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(jsonBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clientes.json'; // Nome do arquivo JSON
  link.click();
  
  // Liberar a URL criada
  URL.revokeObjectURL(url);
});

// Carregar os clientes armazenados ao carregar a página
renderClientes();
