// Camada HTTP: só sabe fazer fetch, montar JSON e transformar resposta de erro
// em exceção. Não conhece cliente, conta, jogador... nem o HTML.
import { API_URL } from './config.js';

// Erro com o status HTTP e a mensagem que a API mandou em { "erro": "..." }.
export class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

async function requisitar(caminho, metodo = 'GET', corpo) {
  const opcoes = { method: metodo, headers: {} };
  if (corpo !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    // fetch só rejeita quando nem chegou resposta: API fora do ar ou CORS bloqueado.
    throw new ErroApi(0, 'Não foi possível conectar à API. Ela está rodando na porta 3000?');
  }

  // 204 No Content (DELETE) não tem corpo: não dá para chamar .json().
  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ErroApi(resposta.status, dados?.erro ?? `Erro ${resposta.status} na API`);
  }
  return dados;
}

export const api = {
  get: (caminho) => requisitar(caminho),
  post: (caminho, corpo) => requisitar(caminho, 'POST', corpo),
  put: (caminho, corpo) => requisitar(caminho, 'PUT', corpo),
  delete: (caminho) => requisitar(caminho, 'DELETE'),
};
