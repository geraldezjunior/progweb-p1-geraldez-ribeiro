// ALUNO: Geraldez Ribeiro de Medeiros Junior

// VIOLA: A classe Library faz tudo: gerencia livros, usuários, empréstimos e até envia e-mails HTTP.
class Library {
  constructor() {
    // SMELL:  Variáveis muito curtas e difíceis de entender (bks = books, us = users).
    this.bks = [];
    this.us = [];
    this.lns = [];
  }

  // SMELL: "doStuff" é um nome extremamente genérico, não diz o que a função faz.
  // SMELL: Esse método é gigantesco e faz coisas demais.
  // VIOLA: Para adicionar uma nova 'action' (ex: renovar), você precisa modificar esse método cheio de IFs.
  doStuff(book, userId, action) {
    // SMELL: Encadeamento de IFs baseados em uma string ('add', 'lend', 'return').
    if (action === 'add') {
      this.bks.push(book);
      console.log('Added: ' + book.t);
    } else if (action === 'lend') {
      // SMELL: 'u' e 'b' não significam nada sozinhos.
      var u = null;
      for (var i = 0; i < this.us.length; i++) {
        if (this.us[i].id === userId) {
          u = this.us[i];
        }
      }
      var b = null;
      for (var j = 0; j < this.bks.length; j++) {
        if (this.bks[j].t === book.t) {
          b = this.bks[j];
        }
      }
      if (u != null && b != null && b.cp > 0) {
        b.cp = b.cp - 1;
        // SMELL: O uso do número 1 sem contexto.
        this.lns.push({ uid: userId, bt: book.t, d: new Date(), st: 1 });

        // 1 = active, 2 = returned, 3 = overdue

        // SMELL: O trecho de fetch (envio de email) se repete aqui e no 'overdue'.
        // VIOLA: A classe depende de uma implementação direta do fetch (detalhe de infraestrutura) ao invés de uma interface de e-mail.
        fetch('http://email.api/send', {
          method: 'POST',
          body: JSON.stringify({ to: u.em, msg: 'Você pegou ' + book.t }),
        })
          .then((r) => {
            /* nada */
          })
          .catch((e) => {});
      }
    } else if (action === 'return') {
      // SMELL: Muitos IFs e FORs dentro uns dos outros.
      for (var k = 0; k < this.lns.length; k++) {
        // SMELL: Número 1 usado para checar status.
        if (
          this.lns[k].uid === userId &&
          this.lns[k].bt === book.t &&
          this.lns[k].st === 1
        ) {
          // SMELL: Magic Numbers - Número 2.
          this.lns[k].st = 2;
          for (var m = 0; m < this.bks.length; m++) {
            if (this.bks[m].t === book.t) {
              this.bks[m].cp = this.bks[m].cp + 1;
            }
          }
        }
      }
    } else if (action === 'overdue') {
      for (var n = 0; n < this.lns.length; n++) {
        // SMELL: Magic Numbers - 1000 * 60 * 60 * 24 e o 7 jogados soltos no código.
        var diff = (new Date() - this.lns[n].d) / (1000 * 60 * 60 * 24);
        if (this.lns[n].st === 1 && diff > 7) {
          // SMELL: Magic Numbers - Número 3.
          this.lns[n].st = 3;
          var usr = null;
          for (var p = 0; p < this.us.length; p++) {
            if (this.us[p].id === this.lns[n].uid) {
              usr = this.us[p];
            }
          }
          if (usr) {
            // SMELL: fetch repetido.
            fetch('http://email.api/send', {
              method: 'POST',
              body: JSON.stringify({
                to: usr.em,
                msg: 'Atrasado: ' + this.lns[n].bt,
              }),
            });
          }
        }
      }
    }
  }

  // SMELL: Uma função não deveria receber 8 parâmetros separados. Deveria receber um objeto DTO (ex: userData).
  registerUser(n, e, ph, addr, cty, st, zp, isAdm) {
    this.us.push({
      id: this.us.length + 1,
      n: n,
      em: e,
      ph: ph,
      addr: addr,
      cty: cty,
      st: st,
      zp: zp,
      isAdm: isAdm,
    });
  }

  // VIOLA: Se precisarmos de um relatório tipo 4, teremos que modificar este arquivo.
  report(type) {
    // SMELL: Magic Numbers - O que é 1, 2 e 3?
    if (type === 1) {
      console.log('Total de livros: ' + this.bks.length);
    } else if (type === 2) {
      console.log('Total de usuários: ' + this.us.length);
    } else if (type === 3) {
      console.log('Total de empréstimos: ' + this.lns.length);
    }
  }
}

// Uso:
const lib = new Library();
lib.registerUser(
  'Ana',
  'ana@uepb.edu.br',
  '83999990000',
  'Rua X, 10',
  'Patos',
  'PB',
  '58700-000',
  false,
);
lib.doStuff({ t: 'Clean Code', cp: 3 }, null, 'add');
lib.doStuff({ t: 'Clean Code' }, 1, 'lend');
lib.report(1);
