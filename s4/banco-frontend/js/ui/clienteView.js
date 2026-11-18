// UI de clientes: desenha o estado na tela e repassa os eventos do usuário.
// Não chama a API. Todo dado entra com textContent (nada de innerHTML).
import { mostrarAviso } from './aviso.js';

const $ = (seletor) => document.querySelector(seletor);

const el = {
  aviso: $('#clientes-aviso'),
  form: $('#cliente-form'),
  formTitulo: $('#cliente-form-titulo'),
  salvar: $('#cliente-salvar'),
  cancelar: $('#cliente-cancelar'),
  recarregar: $('#clientes-recarregar'),
  carregando: $('#clientes-carregando'),
  vazio: $('#clientes-vazio'),
  erro: $('#clientes-erro'),
  erroMsg: $('#clientes-erro-msg'),
  tentar: $('#clientes-tentar'),
  sucesso: $('#clientes-sucesso'),
  tbody: $('#clientes-tbody'),
};

function formatarCpf(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function criarBotao(texto, classe, acao, id) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `btn btn-sm ${classe}`;
  botao.textContent = texto;
  botao.dataset.acao = acao;
  botao.dataset.id = id;
  return botao;
}

function criarLinha(cliente, editandoId) {
  const tr = document.createElement('tr');
  if (cliente.id === editandoId) tr.classList.add('table-active');

  const celulas = [cliente.id, cliente.nome, formatarCpf(cliente.cpf)];
  celulas.forEach((valor) => {
    const td = document.createElement('td');
    td.textContent = valor;
    tr.append(td);
  });

  const acoes = document.createElement('td');
  acoes.className = 'text-end text-nowrap';
  acoes.append(
    criarBotao('Editar', 'btn-outline-secondary me-1', 'editar', cliente.id),
    criarBotao('Remover', 'btn-outline-danger', 'remover', cliente.id),
  );
  tr.append(acoes);
  return tr;
}

let ultimoEditando = null;

function renderizarFormulario(editando) {
  if (editando === ultimoEditando) return;
  ultimoEditando = editando;

  if (editando) {
    el.formTitulo.textContent = `Editando cliente #${editando.id}`;
    el.salvar.textContent = 'Salvar alterações';
    el.form.elements.nome.value = editando.nome;
    el.form.elements.cpf.value = editando.cpf;
    el.cancelar.hidden = false;
    el.form.elements.nome.focus();
  } else {
    el.formTitulo.textContent = 'Novo cliente';
    el.salvar.textContent = 'Cadastrar';
    el.form.reset();
    el.cancelar.hidden = true;
  }
}

export function renderizar(estado) {
  el.carregando.hidden = estado.status !== 'carregando';
  el.vazio.hidden = estado.status !== 'vazio';
  el.erro.hidden = estado.status !== 'erro';
  el.sucesso.hidden = estado.status !== 'sucesso';

  el.erroMsg.textContent = estado.erro ?? '';
  el.tbody.replaceChildren(...estado.itens.map((c) => criarLinha(c, estado.editando?.id)));

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
    aoSalvar({ nome: dados.nome.trim(), cpf: dados.cpf.trim() });
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
