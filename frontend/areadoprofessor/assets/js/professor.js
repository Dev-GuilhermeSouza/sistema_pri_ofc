document.addEventListener("DOMContentLoaded", () => {
  // ===== Login guard =====
  const professor = localStorage.getItem("professorLogado");
  if (!professor) {
    window.location.href = "LoginProfessor.html";
    return;
  }

  // ===== Toast simples =====
  function toast(msg) {
    let t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 14px",
      background: "rgba(0,0,0,.8)",
      color: "#fff",
      borderRadius: "10px",
      fontSize: "14px",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity .2s"
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => (t.style.opacity = "1"));
    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 300);
    }, 1800);
  }

  // ===== Função Correção =====
  function adicionarPerguntaNaCorrecao(pergunta) {
    const lista = document.getElementById("correcaoLista");
    if (!lista) return;
    if (lista.querySelector("p")) lista.innerHTML = ""; // remove mensagem inicial
    const item = document.createElement("div");
    item.classList.add("correcao-item");
    item.innerHTML = `<span>${pergunta}</span> <i class="uil uil-check"></i>`;
    lista.appendChild(item);
  }

  // ===== Injeção CSS mínimo =====
  (function injectSafeCSS() {
    const css = `
      .modal.open { display:flex !important; }
      .professor-table-header { 
        display:grid; grid-template-columns: 2fr 1fr 1fr auto; 
        gap:12px; padding:12px; font-weight:600; border-bottom:1px solid #e5e7eb;
      }
      #professorConteudoTabela { display:block; }
      .professor-table-row {
        display:grid; grid-template-columns: 2fr 1fr 1fr auto;
        gap:12px; align-items:center; padding:12px;
        border-bottom:1px solid #f0f0f0; background: transparent;
      }
      .professor-table-row:nth-child(odd){ background: rgba(0,0,0,0.02); }
      .col-actions button { margin-right:8px; }
      .btn-editar, .btn-excluir {
        padding:6px 10px; border-radius:8px; border:none; cursor:pointer;
      }
      .btn-editar { background:#2563eb; color:#fff; }
      .btn-excluir { background:#ef4444; color:#fff; }
      .fade-row { opacity:0; transform: translateY(6px); transition: opacity .25s, transform .25s; }
      .fade-row.visible { opacity:1; transform:none; }
      .correcao-item {
        display:flex; justify-content:space-between; 
        padding:10px; border-bottom:1px solid #eee;
      }
    `;
    const tag = document.createElement("style");
    tag.textContent = css;
    document.head.appendChild(tag);
  })();

  // ===== Navegação =====
  const menuItems = document.querySelectorAll(".nav-links li");
  const sections = document.querySelectorAll(".dash-content > div");
  function showSection(targetId) {
    sections.forEach(sec => {
      sec.classList.remove("fade-in");
      sec.style.display = "none";
      sec.setAttribute("aria-hidden", "true");
    });
    const target = document.getElementById(targetId);
    if (target) {
      target.removeAttribute("aria-hidden");
      target.style.display = target.classList.contains("flex-section") ? "flex" : "block";
      setTimeout(() => target.classList.add("fade-in"), 50);
    }
  }
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      showSection(item.dataset.target);
    });
  });

  // ===== Modal =====
  const btnNovaPergunta = document.getElementById("importarConteudo");
  const modalPergunta = document.getElementById("modalPergunta");
  const closeModal = document.querySelector(".close-modal");
  const inputIntroducao = document.getElementById("inputIntroducao");
  const inputMateria = document.getElementById("inputMateria");
  const inputData = document.getElementById("inputData");
  const perguntasContainer = document.getElementById("perguntasContainer");
  const btnAdicionarPergunta = document.getElementById("btnAdicionarPergunta");
  const btnSalvar = document.getElementById("salvarPergunta");
  const professorConteudoTabela = document.getElementById("professorConteudoTabela");
  const modalTitle = document.getElementById("modalTitle");

  if (btnSalvar && !btnSalvar.getAttribute("type")) btnSalvar.setAttribute("type", "button");

  // ===== Persistência =====
  function loadStore() {
    return JSON.parse(localStorage.getItem("conteudosProfessor") || "[]");
  }
  function saveStore(arr) {
    localStorage.setItem("conteudosProfessor", JSON.stringify(arr));
  }
  let conteudos = loadStore();
  let editandoId = null;

  // ===== Setar data atual =====
  function setTodayDate() {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    inputData.value = formatted;
  }

  // ===== Abrir/Fechar modal =====
  function abrirModal(novo = true, registro = null) {
    modalPergunta.classList.add("open");
    modalPergunta.style.display = "flex";
    setTodayDate();

    if (novo) {
      editandoId = null;
      modalTitle.textContent = "Criar Pergunta";
      inputIntroducao.value = "";
      inputMateria.value = "Cosmovisão";
      perguntasContainer.innerHTML = `<div class="input-group pergunta-item">
        <label>Pergunta 1</label>
        <input type="text" placeholder="Digite a pergunta..." class="inputPergunta">
      </div>`;
    } else if (registro) {
      editandoId = registro.id;
      modalTitle.textContent = "Editar Pergunta";
      inputIntroducao.value = registro.introducao || "";
      inputMateria.value = registro.materia || "Cosmovisão";
      inputData.value = registro.data || inputData.value;
      perguntasContainer.innerHTML = "";
      registro.perguntas.forEach((p, i) => {
        const div = document.createElement("div");
        div.classList.add("input-group", "pergunta-item");
        div.innerHTML = `<label>Pergunta ${i + 1}</label><input type="text" value="${p}" class="inputPergunta">`;
        perguntasContainer.appendChild(div);
      });
    }
  }
  function fecharModal() { modalPergunta.classList.remove("open"); modalPergunta.style.display = "none"; }

  btnNovaPergunta?.addEventListener("click", () => abrirModal(true));
  closeModal?.addEventListener("click", fecharModal);
  window.addEventListener("click", (e) => { if (e.target === modalPergunta) fecharModal(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });

  // ===== Adicionar perguntas dinamicamente =====
  btnAdicionarPergunta.addEventListener("click", () => {
    const count = perguntasContainer.querySelectorAll(".pergunta-item").length + 1;
    const div = document.createElement("div");
    div.classList.add("input-group", "pergunta-item");
    div.innerHTML = `<label>Pergunta ${count}</label><input type="text" placeholder="Digite a pergunta..." class="inputPergunta">`;
    perguntasContainer.appendChild(div);
  });

  // ===== Salvar conteúdo =====
  btnSalvar.addEventListener("click", () => {
    const introducao = inputIntroducao.value.trim();
    const materia = inputMateria.value;
    const data = inputData.value;
    const perguntas = Array.from(perguntasContainer.querySelectorAll(".inputPergunta"))
      .map(i => i.value.trim()).filter(v => v);

    if (!introducao || perguntas.length === 0) { toast("Preencha introdução e ao menos uma pergunta"); return; }

    if (editandoId !== null) {
      conteudos = conteudos.map(c => c.id === editandoId ? { ...c, introducao, perguntas, materia, data } : c);
      toast("Conteúdo atualizado");
    } else {
      conteudos.push({ id: Date.now(), introducao, perguntas, materia, data });
      toast("Conteúdo criado");

      // >>> AQUI mandamos as perguntas para Correção
      perguntas.forEach(p => adicionarPerguntaNaCorrecao(p));
    }

    saveStore(conteudos);
    fecharModal();
    renderConteudosProfessor();
  });

  // ===== Renderização da tabela =====
  function renderConteudosProfessor() {
    professorConteudoTabela.innerHTML = "";
    if (conteudos.length === 0) {
      professorConteudoTabela.innerHTML = `<div class="professor-table-row">Nenhum conteúdo cadastrado.</div>`;
      return;
    }

    conteudos.forEach(c => {
      const row = document.createElement("div");
      row.classList.add("professor-table-row", "fade-row");
      row.innerHTML = `
        <span class="col-question">${c.perguntas.map((p, i) => `${i + 1}. ${p}`).join("<br>")}</span>
        <span class="col-discipline">${c.materia || "-"}</span>
        <span class="col-date">${c.data || "-"}</span>
        <span class="col-actions">
          <button class="btn-editar" data-id="${c.id}">Editar</button>
          <button class="btn-excluir" data-id="${c.id}">Excluir</button>
        </span>
      `;
      professorConteudoTabela.appendChild(row);
      setTimeout(() => row.classList.add("visible"), 50);
    });
  }

  // ===== Delegação Editar/Excluir =====
  professorConteudoTabela.addEventListener("click", (e) => {
    const target = e.target;
    const id = Number(target.dataset.id);
    if (target.classList.contains("btn-editar")) {
      const registro = conteudos.find(c => c.id === id);
      if (registro) abrirModal(false, registro);
    }
    if (target.classList.contains("btn-excluir")) {
      if (confirm("Deseja realmente excluir este conteúdo?")) {
        conteudos = conteudos.filter(c => c.id !== id);
        saveStore(conteudos);
        renderConteudosProfessor();
        toast("Conteúdo excluído");
      }
    }
  });

  // ===== Inicialização =====
  renderConteudosProfessor();
  showSection("overview");
  menuItems[0]?.classList.add("active");
});

// ===== Correção: carregar respostas dos alunos =====
const correcaoContainer = document.getElementById("correcaoContainer");

function loadRespostas() {
  return JSON.parse(localStorage.getItem("respostasAlunos") || "[]");
}

function renderRespostasAlunos() {
  if (!correcaoContainer) return;

  const respostas = loadRespostas();
  correcaoContainer.innerHTML = "";

  if (respostas.length === 0) {
    correcaoContainer.innerHTML = `<div class="professor-table-row">Nenhuma atividade concluída pelos alunos.</div>`;
    return;
  }

  respostas.forEach((r, i) => {
    const conteudo = conteudos.find(c => c.id === r.idConteudo);
    const row = document.createElement("div");
    row.classList.add("professor-table-row", "fade-row");

    row.innerHTML = `
      <span class="col-question">
        <b>Aluno:</b> ${r.aluno} <br>
        <b>Conteúdo:</b> ${conteudo ? conteudo.introducao : "Desconhecido"} <br>
        <b>Respostas:</b><br>
        ${r.respostas.map((resp, idx) => `<i>P${idx + 1}:</i> ${resp}`).join("<br>")}
      </span>
      <span class="col-discipline">${conteudo?.materia || "-"}</span>
      <span class="col-date">${r.data}</span>
      <span class="col-actions">
        <button class="btn-editar" data-id="${i}">Dar Nota</button>
      </span>
    `;

    correcaoContainer.appendChild(row);
    setTimeout(() => row.classList.add("visible"), 50);
  });
}

// chamar na inicialização
renderRespostasAlunos();
