document.addEventListener("DOMContentLoaded", function () {
  const clienteForm = document.getElementById("clienteForm");
  const clientesTable = document.getElementById("clientesTable").querySelector("tbody");
  const btnDownload = document.getElementById("btnDownload");
  let clientes = [];

  clienteForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    if (!nome || !email || !telefone) {
      Swal.fire("Atenção!", "Preencha todos os campos!", "warning");
      return;
    }

    escolherServico(nome, email, telefone);
  });

  async function escolherServico(nome, email, telefone) {
    const { value: servico } = await Swal.fire({
      title: "Escolha o tipo de serviço",
      input: "select",
      inputOptions: {
        "Mão de Obra": "Mão de Obra",
        "Armazenagem": "Armazenagem",
        "Transporte": "Transporte",
      },
      inputPlaceholder: "Selecione um serviço",
      showCancelButton: true,
    });

    if (!servico) return;

    let detalhes = await capturarDetalhesServico(servico);
    if (!detalhes) return;

    salvarCliente(nome, email, telefone, servico, detalhes);
  }

  async function capturarDetalhesServico(servico) {
    let respostas = [];

    const perguntas = {
      "Mão de Obra": ["Função desejada (ex: Operador de Empilhadeira, Conferente...)", "Quantos colaboradores?"],
      "Armazenagem": ["Metros² necessários", "Localidade"],
      "Transporte": ["Origem e destino (ex: São Paulo -> Rio de Janeiro)", "Tipo de carga", "Peso da carga"],
    };

    for (let pergunta of perguntas[servico]) {
      const { value: resposta } = await Swal.fire({
        title: `Detalhes do serviço de ${servico}`,
        text: pergunta,
        input: "text",
        inputPlaceholder: pergunta,
        showCancelButton: true,
      });

      if (!resposta) return null;
      respostas.push(`${pergunta}: ${resposta}`);
    }

    return respostas.join(" | ");
  }

  function salvarCliente(nome, email, telefone, servico, detalheServico) {
    const novoCliente = { nome, email, telefone, servico, detalheServico };
    clientes.push(novoCliente);
    atualizarTabela();

    Swal.fire({
      title: "Informações enviadas com sucesso!",
      html: `
        Seja bem vindo!<br>A qualquer momento nosso comercial entrará em contato. Sinta-se a vontade para entrar em contato a qualquer momento.<br><br>
        📞 <b>Jorge Costa</b> - (21) 99999-9999<br>
        ✉ <b>jorge.costa@comercial.com.br</b>
      `,
      icon: "success",
    });
    
    clienteForm.reset();
  }

  function atualizarTabela() {
    clientesTable.innerHTML = "";
    clientes.forEach((cliente, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.servico} - ${cliente.detalheServico}</td>
        <td><button onclick="removerCliente(${index})">Excluir</button></td>
      `;
      clientesTable.appendChild(row);
    });
  }

  window.removerCliente = function (index) {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clientes.splice(index, 1);
        atualizarTabela();
        Swal.fire("Excluído!", "O cliente foi removido.", "success");
      }
    });
  };

  btnDownload.addEventListener("click", function () {
    const blob = new Blob([JSON.stringify(clientes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clientes.json";
    link.click();
  });
});
