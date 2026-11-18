// UI de jogadores: desenha o estado na tela e repassa os eventos do usuário.
// Não chama a API. Todo dado entra com textContent (nada de innerHTML).
import { mostrarAviso } from './aviso.js';

const $ = (seletor) => document.querySelector(seletor);

const el = {
  aviso: $('#jogadores-aviso'),
  form: $('#jogador-form'),
  formTitulo: $('#jogador-form-titulo'),
  salvar: $('#jogador-salvar'),
  cancelar: $('#jogador-cancelar'),
  recarregar: $('#jogadores-recarregar'),
  carregando: $('#jogadores-carregando'),
  vazio: $('#jogadores-vazio'),
  erro: $('#jogadores-erro'),
  erroMsg: $('#jogadores-erro-msg'),
  tentar: $('#jogadores-tentar'),
  sucesso: $('#jogadores-sucesso'),
  tbody: $('#jogadores-tbody'),
};

function criarBotao(texto, classe, acao, id) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `btn btn-sm ${classe}`;
  botao.textContent = texto;
  botao.dataset.acao = acao;
  botao.dataset.id = id;
  return botao;
}

function criarLinha(jogador, totalPersonagens, editandoId) {
  const tr = document.createElement('tr');
  if (jogador.id === editandoId) tr.classList.add('table-active');

  [jogador.id, jogador.nome, jogador.nick, totalPersonagens ?? '—'].forEach((valor) => {
    const td = document.createElement('td');
    td.textContent = valor;
    tr.append(td);
  });

  const acoes = document.createElement('td');
  acoes.className = 'text-end text-nowrap';
  acoes.append(
    criarBotao('Editar', 'btn-outline-secondary me-1', 'editar', jogador.id),
    criarBotao('Remover', 'btn-outline-danger', 'remover', jogador.id),
  );
  tr.append(acoes);
  return tr;
}

let ultimoEditando = null;

function renderizarFormulario(editando) {
  if (editando === ultimoEditando) return;
  ultimoEditando = editando;

  if (editando) {
    el.formTitulo.textContent = `Editando jogador #${editando.id}`;
    el.salvar.textContent = 'Salvar alterações';
    el.form.elements.nome.value = editando.nome;
    el.form.elements.nick.value = editando.nick;
    el.cancelar.hidden = false;
    el.form.elements.nome.focus();
  } else {
    el.formTitulo.textContent = 'Novo jogador';
    el.salvar.textContent = 'Cadastrar';
    el.form.reset();
    el.cancelar.hidden = true;
  }
}

// contagem: Map jogadorId -> quantidade de personagens (pode faltar se a lista
// de personagens não carregou).
export function renderizar(estado, contagem) {
  el.carregando.hidden = estado.status !== 'carregando';
  el.vazio.hidden = estado.status !== 'vazio';
  el.erro.hidden = estado.status !== 'erro';
  el.sucesso.hidden = estado.status !== 'sucesso';

  el.erroMsg.textContent = estado.erro ?? '';
  el.tbody.replaceChildren(
    ...estado.itens.map((j) => criarLinha(j, contagem?.get(j.id) ?? (contagem ? 0 : null), estado.editando?.id)),
  );

  renderizarFormulario(estado.editando);
}

export function limparFormulario() {
  el.form.reset();
}

export function avisar(mensagem, tipo) {
  mostrarAviso(el.aviso, mensagem, tipo);
}

export function ocupado(sim) {
  el.salvar.disabled = sim;
}

export function ligarEventos({ aoSalvar, aoEditar, aoRemover, aoCancelar, aoRecarregar }) {
  el.form.addEventListener('submit', (evento) => {
    evento.preventDefault(); // sem isso a página recarrega
    const dados = Object.fromEntries(new FormData(el.form));
    aoSalvar({ nome: dados.nome.trim(), nick: dados.nick.trim() });
  });

  el.cancelar.addEventListener('click', aoCancelar);
  el.recarregar.addEventListener('click', aoRecarregar);
  el.tentar.addEventListener('click', aoRecarregar);

  // Delegação: um ouvinte no tbody atende os botões de todas as linhas.
  el.tbody.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === 'editar') aoEditar(id);
    if (botao.dataset.acao === 'remover') aoRemover(id);
  });
}
