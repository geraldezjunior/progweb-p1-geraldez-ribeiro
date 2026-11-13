// Ponto único de saída de erros, sempre no formato { "erro": "mensagem" }.
// Precisa dos 4 parâmetros para o Express reconhecer como tratador de erro.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }

  const status = err.status ?? 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ erro: status === 500 ? 'Erro interno do servidor' : err.message });
}
