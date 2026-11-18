// Model: só guarda e devolve dados (em memória). Nenhuma regra aqui.
const personagens = [];
let proximoId = 1;

export function listar() {
  return personagens;
}

export function listarPorJogador(jogadorId) {
  return personagens.filter((p) => p.jogadorId === jogadorId);
}

export function buscarPorId(id) {
  return personagens.find((p) => p.id === id);
}

export function criar(dados) {
  const personagem = { id: proximoId++, ...dados };
  personagens.push(personagem);
  return personagem;
}

export function atualizar(id, dados) {
  const personagem = buscarPorId(id);
  Object.assign(personagem, dados);
  return personagem;
}

export function remover(id) {
  const indice = personagens.findIndex((p) => p.id === id);
  personagens.splice(indice, 1);
}
