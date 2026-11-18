// UI: mensagem de feedback (alert do Bootstrap) dentro de um container.
// A mensagem entra com textContent: texto vindo da API nunca vira HTML.

const timers = new WeakMap();

export function mostrarAviso(container, mensagem, tipo = 'danger') {
  limparAviso(container);

  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} d-flex justify-content-between align-items-start mb-3`;
  alerta.setAttribute('role', tipo === 'danger' ? 'alert' : 'status');

  const texto = document.createElement('span');
  texto.textContent = mensagem;

  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'btn-close ms-3';
  fechar.setAttribute('aria-label', 'Fechar');
  fechar.addEventListener('click', () => limparAviso(container));

  alerta.append(texto, fechar);
  container.append(alerta);

  // Sucesso some sozinho; erro fica até o usuário fechar ou agir de novo.
  if (tipo === 'success') {
    timers.set(container, setTimeout(() => limparAviso(container), 4000));
  }
}

export function limparAviso(container) {
  clearTimeout(timers.get(container));
  container.replaceChildren();
}
