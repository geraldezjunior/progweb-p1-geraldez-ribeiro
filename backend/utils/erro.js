// Erro com status HTTP. O service lança, o errorHandler responde.
export class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}
