import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  user: Usuario;
  authSubscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe(auth => {
      this.user = auth.user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  cerrarsesion(): void {

    Swal.fire({
      title: 'Cerrando sesión  ...',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });


    this.authService.cerrarSesion().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    });
  }

}
