document.addEventListener("DOMContentLoaded", () => {
  const tabelaEl = document.getElementById("tabela-atividades");
  if (!tabelaEl) return console.error("Tabela não encontrada");
  const tabela = tabelaEl.querySelector("tbody");

  async function carregarPerguntas() {
    try {
      const res = await fetch("http://localhost:3000/api/perguntas");
      const perguntas = await res.json();

      tabela.innerHTML = "";

      if (!perguntas.length) {
        tabela.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhuma pergunta disponível</td></tr>`;
        return;
      }

      perguntas.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.pergunta}</td>
          <td>${p.disciplina}</td>
          <td>${p.dataCriacao || "-"}</td>
        `;
        tabela.appendChild(tr);
      });
    } catch (err) {
      console.error("Erro ao carregar perguntas:", err);
      tabela.innerHTML = `<tr><td colspan="3" style="text-align:center;">Erro ao carregar perguntas</td></tr>`;
    }
  }

  carregarPerguntas();
});
