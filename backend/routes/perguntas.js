const express = require("express");
const router = express.Router();

// Criar pergunta
router.post("/perguntas", (req, res) => {
  const db = req.app.get("db");
  const io = req.app.get("io");

  const { pergunta, disciplina, introducao } = req.body;

  if (!pergunta || !disciplina) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const stmt = db.prepare(
    "INSERT INTO perguntas (pergunta, disciplina, introducao) VALUES (?, ?, ?)"
  );
  stmt.run(pergunta, disciplina, introducao || "", function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const novaPergunta = {
      id: this.lastID,
      pergunta,
      disciplina,
      introducao: introducao || ""
    };

    // Emite para todos os alunos conectados
    io.emit("novaPergunta", novaPergunta);

    res.json(novaPergunta);
  });
  stmt.finalize();
});

// Listar perguntas
router.get("/perguntas", (req, res) => {
  const db = req.app.get("db");

  db.all("SELECT * FROM perguntas", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
