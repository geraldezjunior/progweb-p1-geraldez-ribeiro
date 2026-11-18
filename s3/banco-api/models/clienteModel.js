// Model: só guarda e devolve dados (em memória). Nenhuma regra aqui.
const clientes = [];
let proximoId = 1;

export function listar() {
  return clientes;
}

export function buscarPorId(id) {
  return clientes.find((c) => c.id === id);
}

export function buscarPorCpf(cpf) {
  return clientes.find((c) => c.cpf === cpf);
}

export function criar(dados) {
  const cliente = { id: proximoId++, ...dados };
  clientes.push(cliente);
  return cliente;
}

export function atualizar(id, dados) {
  const cliente = buscarPorId(id);
  Object.assign(cliente, dados);
  return cliente;
}

export function remover(id) {
  const indice = clientes.findIndex((c) => c.id === id);
  clientes.splice(indice, 1);
}
