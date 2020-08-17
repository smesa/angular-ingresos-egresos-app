import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import * as uiActions from '../../shared/ui.actions';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {


  loginForm: FormGroup;
  isLoading: boolean = false;
  uiSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.isLoading = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  ingresarUsuario(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { correo, password } = this.loginForm.value;


    this.authService.ingresarUsuario(correo, password).then((credenciales: firebase.auth.UserCredential) => {

      this.store.dispatch(uiActions.stopLoading());
      this.router.navigate(['/']);

    }).catch(err => {

      this.store.dispatch(uiActions.stopLoading());

      Swal.fire({
        title: 'Ups',
        text: 'Usuario o contraseña incorrecta',
        icon: 'error'
      });

    });
  }
}
