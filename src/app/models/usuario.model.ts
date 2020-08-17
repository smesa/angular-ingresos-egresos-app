import { NgAnalyzedFileWithInjectables } from '@angular/compiler';

export class Usuario {

  static fromFirestore({ email, nombre, uid }): Usuario {
    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) { }

}
