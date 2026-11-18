// Model: só guarda e devolve dados (em memória). Nenhuma regra aqui.
const jogadores = [];
let proximoId = 1;

export function listar() {
  return jogadores;
}

export function buscarPorId(id) {
  return jogadores.find((j) => j.id === id);
}

export function buscarPorNick(nick) {
  return jogadores.find((j) => j.nick.toLowerCase() === nick.toLowerCase());
}

export function criar(dados) {
  const jogador = { id: proximoId++, ...dados };
  jogadores.push(jogador);
  return jogador;
}

export function atualizar(id, dados) {
  const jogador = buscarPorId(id);
  Object.assign(jogador, dados);
  return jogador;
}

export function remover(id) {
  const indice = jogadores.findIndex((j) => j.id === id);
  jogadores.splice(indice, 1);
}
