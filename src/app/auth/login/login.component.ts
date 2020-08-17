import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  ingresarUsuario(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { correo, password } = this.loginForm.value;


    Swal.fire({
      title: 'Un momento por favor ...',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.ingresarUsuario(correo, password).then((credenciales: firebase.auth.UserCredential) => {
      Swal.close();
      this.router.navigate(['/']);
    }).catch(err => {
      Swal.fire({
        title: 'Ups',
        text: 'Usuario o contraseña incorrecta',
        icon: 'error'
      });
    });
  }
}
