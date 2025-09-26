const telaMaterias = document.getElementById('tela-materias');
const telaIntroducao = document.getElementById('tela-introducao');
const telaPerguntas = document.getElementById('tela-perguntas');
const telaFinal = document.getElementById('tela-final');

const tituloIntroducao = document.getElementById('titulo-introducao');
const textoIntroducao = document.getElementById('texto-introducao');

const btnAvancar = document.getElementById('btn-avancar');
const btnConcluir = document.getElementById('btn-concluir');

const listaMateriasEl = document.getElementById('lista-materias');
const containerPerguntas = document.getElementById('container-perguntas');

let materias = [];
let materiaSelecionada = null;

// Inicializa
carregarMaterias();

async function carregarMaterias() {
  try {
    const res = await fetch('http://localhost:3000/api/perguntas');
    const dados = await res.json();

    const agrupadas = dados.reduce((acc, p) => {
      if (!acc[p.disciplina]) acc[p.disciplina] = { introducao: p.introducao, perguntas: [] };
      acc[p.disciplina].perguntas.push({ id: p.id, texto: p.pergunta });
      return acc;
    }, {});

    materias = Object.keys(agrupadas).map(nome => ({
      nome,
      introducao: agrupadas[nome].introducao,
      perguntas: agrupadas[nome].perguntas
    }));

    renderizarMaterias();
  } catch (err) {
    console.error('Erro ao carregar matérias:', err);
    listaMateriasEl.innerHTML = "<li>Erro ao carregar matérias.</li>";
  }
}

function renderizarMaterias() {
  listaMateriasEl.innerHTML = '';
  if (!materias.length) {
    listaMateriasEl.innerHTML = "<li>Nenhuma matéria disponível.</li>";
    return;
  }

  materias.forEach((m, index) => {
    const li = document.createElement('li');
    li.textContent = `${m.nome} (${m.perguntas.length} pergunta${m.perguntas.length > 1 ? 's' : ''})`;
    li.style.cursor = "pointer";
    li.addEventListener('click', () => abrirIntroducao(index));
    listaMateriasEl.appendChild(li);
  });
}

function abrirIntroducao(index) {
  materiaSelecionada = materias[index];
  tituloIntroducao.textContent = materiaSelecionada.nome;
  textoIntroducao.textContent = materiaSelecionada.introducao;
  alternarTela(telaMaterias, telaIntroducao);
}

btnAvancar.addEventListener('click', () => {
  alternarTela(telaIntroducao, telaPerguntas);
  renderizarPerguntas();
});

function renderizarPerguntas() {
  containerPerguntas.innerHTML = '';
  materiaSelecionada.perguntas.forEach((p, i) => {
    const div = document.createElement('div');
    div.classList.add('question');
    div.innerHTML = `<p>${i + 1}. ${p.texto}</p>
                     <input type="text" class="resposta-pergunta" data-id="${p.id}">`;
    containerPerguntas.appendChild(div);
  });
}

btnConcluir.addEventListener('click', async () => {
  const respostas = coletarRespostas();
  if (!respostas) {
    alert('Preencha todas as respostas!');
    return;
  }

  try {
    await Promise.all(respostas.map(r =>
      fetch('http://localhost:3000/api/respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perguntaId: r.id,
          aluno: "Aluno Exemplo",
          resposta: r.resposta
        })
      })
    ));

    alternarTela(telaPerguntas, telaFinal);

  } catch (err) {
    console.error('Erro ao enviar respostas:', err);
    alert('Erro ao enviar respostas.');
  }
});

function coletarRespostas() {
  const inputs = document.querySelectorAll('.resposta-pergunta');
  const respostas = [];
  for (let inp of inputs) {
    if (!inp.value.trim()) return null;
    respostas.push({ id: inp.dataset.id, resposta: inp.value.trim() });
  }
  return respostas;
}

// Alterna telas com fade
function alternarTela(telaOculta, telaVisivel) {
  telaOculta.classList.add('fade-out');
  telaOculta.addEventListener('animationend', function handler() {
    telaOculta.classList.remove('fade-out');
    telaOculta.style.display = 'none';

    telaVisivel.style.display = 'block';
    telaVisivel.classList.add('fade-in');
    telaVisivel.addEventListener('animationend', function handler2() {
      telaVisivel.classList.remove('fade-in');
      telaVisivel.removeEventListener('animationend', handler2);
    });

    telaOculta.removeEventListener('animationend', handler);
  });
}
