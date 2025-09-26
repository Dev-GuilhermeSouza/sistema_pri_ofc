db.run(`
  CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    perguntaId INTEGER,
    aluno TEXT,
    resposta TEXT,
    dataCriacao TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (perguntaId) REFERENCES perguntas(id)
  )
`);
