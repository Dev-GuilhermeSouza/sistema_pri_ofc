const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// Usuários de exemplo (em produção, isso viria do servidor)
const professores = [
  { email: "professor@escola.com", senha: "123456", nome: "Prof. Guilherme" }
];

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const usuario = professores.find(p => p.email === email && p.senha === senha);

  if (usuario) {
    // Armazena sessão do professor
    localStorage.setItem("professorLogado", JSON.stringify(usuario));
    window.location.href = "frontend/areadoprofessor/professor.html"; // Redireciona para painel
  } else {
    loginError.textContent = "Email ou senha incorretos";
  }
});

// Seleciona o link de logout
const logoutBtn = document.querySelector(".logout-mode a");

// Evento de clique
logoutBtn.addEventListener("click", e => {
  e.preventDefault(); // previne o comportamento padrão do link
  localStorage.removeItem("professorLogado"); // remove sessão
  window.location.href = "LoginProfessor.html"; // redireciona para login
});
