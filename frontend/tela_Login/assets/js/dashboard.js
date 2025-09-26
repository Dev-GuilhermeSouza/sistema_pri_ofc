document.addEventListener("DOMContentLoaded", () => {
  const tabelaEl = document.getElementById("tabela-atividades");
  if (!tabelaEl) return;
  const tabela = tabelaEl.querySelector("tbody");

  const totalRespondidasEl = document.getElementById("total-respondidas");
  const totalPendentesEl = document.getElementById("total-pendentes");
  const totalPerguntasEl = document.getElementById("total-perguntas");

  // Recupera respostas salvas
  const respostas = JSON.parse(localStorage.getItem("respostasAluno") || "{}");
  const conteudos = JSON.parse(localStorage.getItem("conteudosProfessor") || "[]");

  tabela.innerHTML = "";

  let totalRespondidas = 0;
  let totalPerguntas = 0;

  conteudos.forEach(materia => {
    const respostasMateria = respostas[materia.id] || [];
    totalRespondidas += respostasMateria.length;
    totalPerguntas += materia.perguntas.length;

    // Adiciona na tabela
    materia.perguntas.forEach((pergunta, index) => {
      const resposta = respostasMateria[index] || "— Pendente —";
      const status = resposta === "— Pendente —" ? 
        `<span style="color: red;">Pendente</span>` : 
        `<span style="color: green;">Concluído</span>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${pergunta}</td>
        <td>${materia.materia}</td>
        <td>${new Date().toLocaleDateString("pt-BR")}</td>
        <td>${status}</td>
      `;
      tabela.appendChild(tr);
    });
  });

  // Atualiza os cards
  if (totalRespondidasEl) totalRespondidasEl.textContent = totalRespondidas;
  if (totalPerguntasEl) totalPerguntasEl.textContent = totalPerguntas;
  if (totalPendentesEl) totalPendentesEl.textContent = totalPerguntas - totalRespondidas;
});
