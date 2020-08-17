import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  isLoading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.isLoading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(): void {


    if (this.registroForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());
    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password).then(() => {

      this.store.dispatch(uiActions.stopLoading());
      this.router.navigate(['/']);

    }).catch(err => {

      this.store.dispatch(uiActions.stopLoading());

      Swal.fire({
        title: 'Ups',
        text: err.message,
        icon: 'error'
      });

    });
  }

}
