// UI de personagens: desenha o estado na tela e repassa os eventos do usuário.
// Depende da lista de jogadores para montar os <select> e mostrar o nick do dono.
// Não chama a API. Todo dado entra com textContent (nada de innerHTML).
import { mostrarAviso } from './aviso.js';

const $ = (seletor) => document.querySelector(seletor);

const el = {
  aviso: $('#personagens-aviso'),
  form: $('#personagem-form'),
  formTitulo: $('#personagem-form-titulo'),
  jogador: $('#personagem-jogador'),
  jogadorAjuda: $('#personagem-jogador-ajuda'),
  salvar: $('#personagem-salvar'),
  cancelar: $('#personagem-cancelar'),
  filtro: $('#personagens-filtro'),
  recarregar: $('#personagens-recarregar'),
  carregando: $('#personagens-carregando'),
  vazio: $('#personagens-vazio'),
  vazioMsg: $('#personagens-vazio-msg'),
  erro: $('#personagens-erro'),
  erroMsg: $('#personagens-erro-msg'),
  tentar: $('#personagens-tentar'),
  sucesso: $('#personagens-sucesso'),
  tbody: $('#personagens-tbody'),
};

const NOME_CLASSE = { guerreiro: 'Guerreiro', mago: 'Mago' };

function criarOpcao(valor, texto) {
  const opcao = document.createElement('option');
  opcao.value = valor;
  opcao.textContent = texto;
  return opcao;
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

function criarLinha(personagem, jogadoresPorId, editandoId) {
  const tr = document.createElement('tr');
  if (personagem.id === editandoId) tr.classList.add('table-active');

  const dono = jogadoresPorId.get(personagem.jogadorId);
  const valores = [
    personagem.id,
    personagem.nome,
    NOME_CLASSE[personagem.classe] ?? personagem.classe,
    personagem.nivel,
    dono ? dono.nick : `#${personagem.jogadorId}`,
    `${personagem.hp} / ${personagem.mp} / ${personagem.ataque} / ${personagem.defesa}`,
  ];
  valores.forEach((valor) => {
    const td = document.createElement('td');
    td.textContent = valor;
    tr.append(td);
  });

  const acoes = document.createElement('td');
  acoes.className = 'text-end text-nowrap';
  acoes.append(
    criarBotao('Editar', 'btn-outline-secondary me-1', 'editar', personagem.id),
    criarBotao('Remover', 'btn-outline-danger', 'remover', personagem.id),
  );
  tr.append(acoes);
  return tr;
}

// <select> do formulário: escolhe o jogador "pai" do personagem.
function renderizarSelectJogador(jogadores) {
  const selecionado = el.jogador.value;
  const opcoes = [];

  if (jogadores.itens.length > 0) {
    opcoes.push(criarOpcao('', 'Selecione um jogador'));
    jogadores.itens.forEach((j) => opcoes.push(criarOpcao(j.id, `${j.nick} (${j.nome})`)));
  } else if (jogadores.status === 'carregando') {
    opcoes.push(criarOpcao('', 'Carregando jogadores…'));
  } else if (jogadores.status === 'erro') {
    opcoes.push(criarOpcao('', 'Não foi possível carregar os jogadores'));
  } else {
    opcoes.push(criarOpcao('', 'Cadastre um jogador primeiro'));
  }

  el.jogador.replaceChildren(...opcoes);
  el.jogador.value = selecionado;
  if (el.jogador.value !== selecionado) el.jogador.value = '';

  const semJogadores = jogadores.itens.length === 0;
  el.jogador.disabled = semJogadores;
  el.salvar.disabled = semJogadores;
  el.jogadorAjuda.hidden = !semJogadores || jogadores.status !== 'vazio';
}

// <select> do filtro da lista (GET /personagens?jogadorId=).
function renderizarFiltro(jogadores, filtroJogadorId) {
  el.filtro.replaceChildren(
    criarOpcao('', 'Todos os jogadores'),
    ...jogadores.itens.map((j) => criarOpcao(j.id, j.nick)),
  );
  el.filtro.value = filtroJogadorId ?? '';
}

let ultimoEditando = null;

function renderizarFormulario(editando) {
  if (editando === ultimoEditando) return;
  ultimoEditando = editando;

  if (editando) {
    el.formTitulo.textContent = `Editando personagem #${editando.id}`;
    el.salvar.textContent = 'Salvar alterações';
    el.form.elements.nome.value = editando.nome;
    el.form.elements.classe.value = editando.classe;
    el.form.elements.nivel.value = editando.nivel;
    el.form.elements.jogadorId.value = editando.jogadorId;
    el.cancelar.hidden = false;
    el.form.elements.nome.focus();
  } else {
    el.formTitulo.textContent = 'Novo personagem';
    el.salvar.textContent = 'Cadastrar';
    el.form.reset();
    el.cancelar.hidden = true;
  }
}

export function renderizar(estado, jogadores) {
  el.carregando.hidden = estado.status !== 'carregando';
  el.vazio.hidden = estado.status !== 'vazio';
  el.erro.hidden = estado.status !== 'erro';
  el.sucesso.hidden = estado.status !== 'sucesso';

  el.erroMsg.textContent = estado.erro ?? '';
  el.vazioMsg.textContent = estado.filtroJogadorId
    ? 'Este jogador ainda não tem personagens.'
    : 'Nenhum personagem cadastrado ainda.';

  const jogadoresPorId = new Map(jogadores.itens.map((j) => [j.id, j]));
  el.tbody.replaceChildren(
    ...estado.itens.map((p) => criarLinha(p, jogadoresPorId, estado.editando?.id)),
  );

  renderizarSelectJogador(jogadores);
  renderizarFiltro(jogadores, estado.filtroJogadorId);
  renderizarFormulario(estado.editando);
}

export function limparFormulario() {
  el.form.reset();
}

export function avisar(mensagem, tipo) {
  mostrarAviso(el.aviso, mensagem, tipo);
}

export function ocupado(sim) {
  el.salvar.disabled = sim || el.jogador.disabled;
}

export function ligarEventos({ aoSalvar, aoEditar, aoRemover, aoCancelar, aoRecarregar, aoFiltrar }) {
  el.form.addEventListener('submit', (evento) => {
    evento.preventDefault(); // sem isso a página recarrega
    const dados = Object.fromEntries(new FormData(el.form));
    aoSalvar({
      nome: dados.nome.trim(),
      classe: dados.classe,
      nivel: Number(dados.nivel),
      jogadorId: Number(dados.jogadorId),
    });
  });

  el.cancelar.addEventListener('click', aoCancelar);
  el.recarregar.addEventListener('click', aoRecarregar);
  el.tentar.addEventListener('click', aoRecarregar);
  el.filtro.addEventListener('change', () => aoFiltrar(el.filtro.value ? Number(el.filtro.value) : null));

  // Delegação: um ouvinte no tbody atende os botões de todas as linhas.
  el.tbody.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === 'editar') aoEditar(id);
    if (botao.dataset.acao === 'remover') aoRemover(id);
  });
}
