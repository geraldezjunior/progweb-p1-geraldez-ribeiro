import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// As regras do service (MODELAGEM.md) também ficam garantidas aqui no banco:
// - nick único sem diferenciar maiúsculas/minúsculas (COLLATE NOCASE)
// - classe só guerreiro ou mago, nível de 1 a 100 (CHECK)
// - nome do personagem único dentro do mesmo jogador (UNIQUE composto)
// - jogador_id precisa apontar para um jogador existente (REFERENCES).
//   Sem ON DELETE CASCADE: remover jogador com personagens é bloqueado
//   (o jogadorService responde 409 antes de chegar ao banco).
db.exec(`
  CREATE TABLE IF NOT EXISTS jogadores (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nick TEXT NOT NULL UNIQUE COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS personagens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT    NOT NULL COLLATE NOCASE,
    classe     TEXT    NOT NULL CHECK (classe IN ('guerreiro', 'mago')),
    nivel      INTEGER NOT NULL DEFAULT 1 CHECK (nivel BETWEEN 1 AND 100),
    hp         INTEGER NOT NULL,
    mp         INTEGER NOT NULL,
    ataque     INTEGER NOT NULL,
    defesa     INTEGER NOT NULL,
    jogador_id INTEGER NOT NULL REFERENCES jogadores(id),
    UNIQUE (jogador_id, nome)
  );
`);
