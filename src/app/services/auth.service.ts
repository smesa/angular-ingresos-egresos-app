import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener(): void {
    this.auth.authState.subscribe((fuser: firebase.User) => {

      if (fuser) {

        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirestore(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });

      } else {

        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());

      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(email, password).then(({ user }) => {
      const newUser = new Usuario(user.uid, nombre, user.email);

      return user.updateProfile({ displayName: nombre }).then(() => {
        return this.firestore.doc(`${user.uid}/usuario`)
          .set({ ...newUser });
      });

    });
  }

  ingresarUsuario(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion(): Promise<void> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(user => user != null)
    );
  }
}
