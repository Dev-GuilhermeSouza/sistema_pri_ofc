document.addEventListener("DOMContentLoaded", () => {
  const listaMaterias = document.getElementById("lista-materias");
  const telaMaterias = document.getElementById("tela-materias");
  const telaIntroducao = document.getElementById("tela-introducao");
  const telaPerguntas = document.getElementById("tela-perguntas");
  const telaFinal = document.getElementById("tela-final");

  const tituloIntroducao = document.getElementById("titulo-introducao");
  const textoIntroducao = document.getElementById("texto-introducao");
  const containerPerguntas = document.getElementById("container-perguntas");

  const btnAvancar = document.getElementById("btn-avancar");
  const btnConcluir = document.getElementById("btn-concluir");

  const conteudos = JSON.parse(localStorage.getItem("conteudosProfessor") || "[]");
  let materiaAtual = null;
  let respostas = JSON.parse(localStorage.getItem("respostasAluno") || "{}");

  // Função para salvar respostas no localStorage (para o próprio aluno revisar)
  function salvarRespostas() {
    localStorage.setItem("respostasAluno", JSON.stringify(respostas));
  }

  // Listar matérias na tela inicial
  function listarMaterias() {
    if (conteudos.length === 0) {
      listaMaterias.innerHTML = "<li>Nenhuma matéria cadastrada</li>";
      return;
    }

    listaMaterias.innerHTML = "";
    conteudos.forEach((c, index) => {
      const li = document.createElement("li");
      li.textContent = c.materia;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => abrirIntroducao(index));
      listaMaterias.appendChild(li);
    });
  }

  // Abrir introdução da matéria
  function abrirIntroducao(index) {
    materiaAtual = conteudos[index];
    telaMaterias.style.display = "none";
    telaIntroducao.style.display = "block";

    tituloIntroducao.textContent = materiaAtual.materia;
    textoIntroducao.textContent = materiaAtual.introducao;
  }

  // Avançar para perguntas
  btnAvancar.addEventListener("click", () => {
    telaIntroducao.style.display = "none";
    telaPerguntas.style.display = "block";

    containerPerguntas.innerHTML = "";
    materiaAtual.perguntas.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("question");
      const respostaSalva = respostas[materiaAtual.id]?.[i] || "";
      div.innerHTML = `
        <label>Pergunta ${i + 1}: ${p}</label>
        <input type="text" data-index="${i}" value="${respostaSalva}" placeholder="Sua resposta">
        <small class="error-msg" style="color:red; display:none;">⚠ Campo obrigatório</small>
      `;
      containerPerguntas.appendChild(div);
    });

    // Validação dinâmica enquanto digita
    containerPerguntas.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        const msg = input.parentElement.querySelector(".error-msg");
        if (input.value.trim() === "") {
          msg.style.display = "block";
          input.style.borderColor = "red";
          input.style.backgroundColor = "#ffe5e5";
        } else {
          msg.style.display = "none";
          input.style.borderColor = "green";
          input.style.backgroundColor = "#e6ffe6";
        }
      });
    });
  });

  // Concluir atividade
  btnConcluir.addEventListener("click", () => {
    const inputs = containerPerguntas.querySelectorAll("input");
    let valido = true;

    inputs.forEach(input => {
      const msg = input.parentElement.querySelector(".error-msg");
      if (input.value.trim() === "") {
        msg.style.display = "block";
        input.style.borderColor = "red";
        input.style.backgroundColor = "#ffe5e5";
        valido = false;
      }
    });

    if (!valido) return; // Se tiver erro, não prossegue

    // Se tudo ok, salva as respostas do aluno (para ele mesmo)
    const respostasAluno = Array.from(inputs).map(i => i.value.trim());
    respostas[materiaAtual.id] = respostasAluno;
    salvarRespostas();

    // 🔹 Também salva no "respostasAlunos" (para o professor ver na aba Correção)
    let respostasAlunos = JSON.parse(localStorage.getItem("respostasAlunos") || "[]");

    respostasAlunos.push({
      idConteudo: materiaAtual.id,
      aluno: localStorage.getItem("alunoLogado") || "Aluno Anônimo",
      respostas: respostasAluno,
      data: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("respostasAlunos", JSON.stringify(respostasAlunos));

    // Troca de tela
    telaPerguntas.style.display = "none";
    telaFinal.style.display = "block";
  });

  // Botão para voltar ao início
  const btnVoltar = document.createElement("button");
  btnVoltar.textContent = "Voltar para lista";
  btnVoltar.addEventListener("click", () => {
    telaFinal.style.display = "none";
    telaMaterias.style.display = "block";
  });
  telaFinal.appendChild(btnVoltar);

  listarMaterias();
});
