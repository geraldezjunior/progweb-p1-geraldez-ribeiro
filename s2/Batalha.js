class Batalha {
  constructor(personagem01, personagem02) {
    this.personagem01 = personagem01;
    this.personagem02 = personagem02;
    this.turno = 1;
  }

  iniciar() {
    console.log(
      `--- INÍCIO DA BATALHA: ${this.personagem01.nome} vs ${this.personagem02.nome} ---`,
    );

    while (this.personagem01.estaVivo() && this.personagem02.estaVivo()) {
      console.log(`\n--- Turno ${this.turno} ---`);

      this.personagem01.usarHabilidadeEspecial(this.personagem02);

      if (!this.personagem02.estaVivo()) {
        console.log(`\n🎉 Vitória! ${this.personagem02.nome} foi derrotado!`);
        break;
      }

      console.log(`\nContra-ataque do personagem02:`);
      this.personagem02.usarHabilidadeEspecial
        ? this.personagem02.usarHabilidadeEspecial(this.personagem01)
        : this.personagem01.receberDano(this.personagem02.ataque);

      if (!this.personagem01.estaVivo()) {
        console.log(
          `\n💀 Derrota! ${this.personagem01.nome} sucumbiu em batalha.`,
        );
        break;
      }

      this.turno++;
    }
  }
}
