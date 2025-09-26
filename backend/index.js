const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Banco de dados SQLite
const dbPath = path.resolve(__dirname, "sistema.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Conectado ao banco SQLite.");
  }
});

app.use(cors());
app.use(express.json());

// Disponibiliza io e db para as rotas
app.set("io", io);
app.set("db", db);

// Rotas de perguntas
const perguntasRoutes = require("./routes/perguntas");
app.use("/api", perguntasRoutes);

// =============================
// ROTAS DE RESPOSTAS
// =============================
app.post("/api/respostas", (req, res) => {
  const { perguntaId, aluno, resposta, materia, respostas } = req.body;

  if (respostas) {
    // Caso venha várias respostas de uma vez (lote)
    respostas.forEach((r) => {
      db.run(
        "INSERT INTO respostas (pergunta_id, resposta, materia) VALUES (?, ?, ?)",
        [r.pergunta_id, r.resposta, materia]
      );
    });
    return res.json({ sucesso: true, tipo: "lote" });
  }

  // Caso venha apenas 1 resposta
  if (!perguntaId || !aluno || !resposta) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const stmt = db.prepare(
    "INSERT INTO respostas (perguntaId, aluno, resposta) VALUES (?, ?, ?)"
  );
  stmt.run(perguntaId, aluno, resposta, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, perguntaId, aluno, resposta });
  });
  stmt.finalize();
});

// GET: listar respostas por pergunta
app.get("/api/respostas/:perguntaId", (req, res) => {
  const { perguntaId } = req.params;
  db.all(
    "SELECT * FROM respostas WHERE perguntaId = ?",
    [perguntaId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// =============================
// ROTAS DE MATÉRIAS
// =============================
app.get("/api/materias", (req, res) => {
  db.all("SELECT * FROM materias", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Perguntas por matéria
app.get("/api/perguntas/:materia", (req, res) => {
  const { materia } = req.params;
  db.all("SELECT * FROM perguntas WHERE materia = ?", [materia], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// =============================
// INICIA SERVIDOR
// =============================
server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
