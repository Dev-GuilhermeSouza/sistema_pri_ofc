document.addEventListener("DOMContentLoaded", () => {
    // Elementos principais
    const inputs = document.querySelectorAll("input");
    const buttons = document.querySelectorAll("button");

    /* ====== Efeitos visuais nos inputs ====== */
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.transition = "all 0.3s ease";
            input.style.boxShadow = "0 0 6px rgba(90, 62, 220, 0.5)";
            input.style.transform = "scale(1.02)";
        });

        input.addEventListener("blur", () => {
            input.style.boxShadow = "none";
            input.style.transform = "scale(1)";
        });
    });

    /* ====== Efeitos visuais nos botões ====== */
    buttons.forEach(btn => {
        btn.addEventListener("mouseover", () => {
            btn.style.transition = "all 0.3s ease";
            btn.style.transform = "scale(1.05)";
            btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        });

        btn.addEventListener("mouseout", () => {
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "none";
        });

        btn.addEventListener("click", () => {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => (btn.style.transform = "scale(1)"), 150);
        });
    });

    /* ====== Toast de mensagens rápidas ====== */
    function showMessage(msg, type = "error") {
        let messageBox = document.createElement("div");
        messageBox.textContent = msg;
        messageBox.style.position = "fixed";
        messageBox.style.top = "20px";
        messageBox.style.right = "20px";
        messageBox.style.padding = "12px 20px";
        messageBox.style.borderRadius = "8px";
        messageBox.style.color = "#fff";
        messageBox.style.zIndex = "1000";
        messageBox.style.fontWeight = "bold";
        messageBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
        messageBox.style.opacity = "0";
        messageBox.style.transition = "opacity 0.5s ease";

        messageBox.style.background = type === "error" ? "#e74c3c" : "#2ecc71";

        document.body.appendChild(messageBox);

        setTimeout(() => (messageBox.style.opacity = "1"), 100);
        setTimeout(() => {
            messageBox.style.opacity = "0";
            setTimeout(() => messageBox.remove(), 500);
        }, 3000);
    }

    /* ====== Modal com redirecionamento ====== */
    function showModal(message, redirect = null) {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.6)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "2000";

        const modal = document.createElement("div");
        modal.style.background = "#fff";
        modal.style.padding = "30px 40px";
        modal.style.borderRadius = "12px";
        modal.style.textAlign = "center";
        modal.style.color = "#333";
        modal.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";

        const text = document.createElement("h3");
        text.textContent = message;
        text.style.marginBottom = "20px";

        const btn = document.createElement("button");
        btn.textContent = "OK";
        btn.style.padding = "10px 20px";
        btn.style.background = "#5a3edc";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "16px";
        btn.style.transition = "all 0.2s ease";

        btn.addEventListener("mouseover", () => btn.style.background = "#4a2fc9");
        btn.addEventListener("mouseout", () => btn.style.background = "#5a3edc");
        btn.addEventListener("click", () => {
            overlay.remove();
            if (redirect) window.location.href = redirect;
        });

        modal.appendChild(text);
        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    /* ====== Funções de Validação por Tela ====== */
    function validarLogin() {
        let ra = document.getElementById("username");
        let senha = document.getElementById("password");

        if (!ra || !senha) return false;

        if (!ra.value.trim() || !senha.value.trim()) {
            showMessage("RA e senha são obrigatórios!");
            return false;
        }
        if (senha.value.length < 6) {
            showMessage("A senha precisa ter pelo menos 6 caracteres!");
            return false;
        }
        return true;
    }

    function validarRecuperacao() {
        let ra = document.getElementById("username");
        let email = document.getElementById("email");
        let cemail = document.getElementById("cmail");

        if (!ra || !email || !cemail) return false;

        if (!ra.value.trim() || !email.value.trim() || !cemail.value.trim()) {
            showMessage("Preencha todos os campos!");
            return false;
        }
        if (email.value !== cemail.value) {
            showMessage("Os e-mails não coincidem!");
            return false;
        }
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.value)) {
            showMessage("Digite um e-mail válido!");
            return false;
        }
        return true;
    }

    function validarCadastro() {
        let ra = document.getElementById("username");
        let data = document.getElementById("data");
        let email = document.getElementById("email");
        let cemail = document.getElementById("cmail");
        let senha = document.getElementById("password");
        let csenha = document.getElementById("cpassword");
        let termo = document.getElementById("termo");

        if (!ra || !data || !email || !cemail || !senha || !csenha || !termo) return false;

        if (!ra.value.trim() || !data.value.trim() || !email.value.trim() || !cemail.value.trim() || !senha.value.trim() || !csenha.value.trim()) {
            showMessage("Todos os campos são obrigatórios!");
            return false;
        }
        if (email.value !== cemail.value) {
            showMessage("Os e-mails não coincidem!");
            return false;
        }
        if (senha.value.length < 6) {
            showMessage("A senha precisa ter pelo menos 6 caracteres!");
            return false;
        }
        if (senha.value !== csenha.value) {
            showMessage("As senhas não coincidem!");
            return false;
        }
        if (!termo.checked) {
            showMessage("Você precisa aceitar os termos!");
            return false;
        }
        return true;
    }

    /* ====== Botões com verificação ====== */
    buttons.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();

            if (btn.innerText.includes("Login")) {
                if (validarLogin()) {
                    showModal("Login realizado com sucesso!", "home.html");
                }
            }

            if (btn.innerText.includes("Criar conta")) {
                if (validarCadastro()) {
                    showModal("Conta criada com sucesso!", "login.html");
                }
            }

            if (btn.innerText.includes("Obter código")) {
                if (validarRecuperacao()) {
                    showModal("Código enviado para o seu e-mail!", "password.html");
                }
            }
        });
    });
});
