document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sidebar = document.querySelector('nav');
  const modeToggle = document.querySelector('.mode-toggle'); 
  const modeLink = document.querySelector('.mode > a'); // o link do modo
  const sidebarToggle = document.querySelector('.sidebar-toggle');

  const tbody = document.getElementById("atividade-tabela");

  const atividades = [
    {nome: "Ler capítulo 1", data: "2025-09-04", status: "Feito"},
    {nome: "Exercício de Matemática", data: "2025-09-03", status: "Feito"},
    {nome: "Prática de programação", data: "2025-09-02", status: "Não Feito"},
    {nome: "Redação sobre meio ambiente", data: "2025-09-01", status: "Feito"},
    {nome: "Resolução de problemas de física", data: "2025-08-31", status: "Feito"},
    {nome: "Pesquisa de história", data: "2025-08-30", status: "Não Feito"},
    {nome: "Estudo de gramática", data: "2025-08-29", status: "Não Feito"},
    {nome: "Projeto de ciências", data: "2025-08-28", status: "Não Feito"},
    {nome: "Atividade de inglês", data: "2025-08-27", status: "Não Feito"},
    {nome: "Resumo de geografia", data: "2025-08-26", status: "Feito"}
  ];

  // ===== Funções de Dark Mode =====
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  function applyMode(isDark) {
    body.classList.toggle('dark', !!isDark);
    safeSet('mode', isDark ? 'dark' : 'light');
  }

  function toggleMode(e) {
    if(e) e.preventDefault(); // evita que o link recarregue a página
    applyMode(!body.classList.contains('dark'));
  }

  // ===== Funções de Sidebar =====
  function applySidebar(isClosed) {
    sidebar.classList.toggle('close', !!isClosed);
    safeSet('status', isClosed ? 'close' : 'open');
  }

  // ===== Inicialização =====
  applyMode(safeGet('mode') === 'dark');
  applySidebar(safeGet('status') === 'close');

  // ===== Eventos =====
  if (modeToggle) modeToggle.addEventListener('click', toggleMode);
  if (modeLink) modeLink.addEventListener('click', toggleMode);
  if (sidebarToggle) sidebarToggle.addEventListener('click', () => applySidebar(!sidebar.classList.contains('close')));

  // ===== Tabela de Atividades =====
  function calcularDiasAtraso(dataEntrega) {
    const hoje = new Date();
    const entrega = new Date(dataEntrega);
    const diff = Math.floor((hoje - entrega) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  function gerarTabela() {
    tbody.innerHTML = "";
    atividades.forEach(a => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = a.nome;

      const tdData = document.createElement("td");
      tdData.textContent = a.data;

      const tdStatus = document.createElement("td");
      tdStatus.textContent = a.status;

      const diasAtraso = calcularDiasAtraso(a.data);
      const tdAtraso = document.createElement("td");
      tdAtraso.textContent = diasAtraso;

      if (a.status === "Feito") {
        tdStatus.className = "status feito";
      } else {
        tdStatus.className = diasAtraso > 0 ? "status atrasado" : "status nao-feito";
      }

      tr.append(tdNome, tdData, tdStatus, tdAtraso);
      tbody.appendChild(tr);
    });
  }

  gerarTabela();
});
