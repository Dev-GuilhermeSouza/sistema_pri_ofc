// Seletores das telas
const telaMaterias = document.getElementById("tela-materias");
const telaIntroducao = document.getElementById("tela-introducao");
const telaPerguntas = document.getElementById("tela-perguntas");
const telaFinal = document.getElementById("tela-final");

const tituloIntroducao = document.getElementById("titulo-introducao");
const textoIntroducao = document.getElementById("texto-introducao");
const listaMaterias = document.getElementById("lista-materias");
const containerPerguntas = document.getElementById("container-perguntas");

const btnAvancar = document.getElementById("btn-avancar");
const btnConcluir = document.getElementById("btn-concluir");

let materiaSelecionada = null;
let perguntasAtuais = [];

// Função para alternar telas
function mostrarTela(id) {
  [telaMaterias, telaIntroducao, telaPerguntas, telaFinal].forEach(tela => {
    tela.style.display = (tela.id === id) ? "block" : "none";
  });
}

// 1. Carregar matérias do backend
async function carregarMaterias() {
  try {
    const res = await fetch("http://localhost:3000/api/materias");
    const materias = await res.json();

    listaMaterias.innerHTML = "";
    materias.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.nome;
      li.classList.add("materia-item");
      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        materiaSelecionada = m.nome;
        tituloIntroducao.textContent = `Matéria: ${m.nome}`;
        textoIntroducao.textContent = m.descricao || "Introdução da matéria.";
        mostrarTela("tela-introducao");
      });

      listaMaterias.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar matérias:", err);
  }
}

// 2. Carregar perguntas da matéria selecionada
async function carregarPerguntas(materia) {
  try {
    const res = await fetch(`http://localhost:3000/api/perguntas/${materia}`);
    perguntasAtuais = await res.json();

    containerPerguntas.innerHTML = "";
    perguntasAtuais.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("question");
      div.innerHTML = `
        <label>${p.enunciado}</label>
        <input type="text" name="resposta-${p.id}" />
      `;
      containerPerguntas.appendChild(div);
    });
  } catch (err) {
    console.error("Erro ao carregar perguntas:", err);
  }
}

// 3. Avançar da introdução para perguntas
btnAvancar.addEventListener("click", () => {
  if (!materiaSelecionada) return;
  carregarPerguntas(materiaSelecionada);
  mostrarTela("tela-perguntas");
});

// 4. Concluir e enviar respostas
btnConcluir.addEventListener("click", async () => {
  const respostas = [];
  perguntasAtuais.forEach(p => {
    const input = document.querySelector(`input[name="resposta-${p.id}"]`);
    respostas.push({ pergunta_id: p.id, resposta: input.value });
  });

  console.log("Respostas do aluno:", respostas);

  // Aqui você pode salvar no backend (exemplo):
  /*
  await fetch("http://localhost:3000/api/respostas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materia: materiaSelecionada, respostas })
  });
  */

  mostrarTela("tela-final");
});

// Inicializar
carregarMaterias();
  