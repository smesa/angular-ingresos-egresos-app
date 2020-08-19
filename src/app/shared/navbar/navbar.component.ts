import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  user: Usuario;
  authSubscription: Subscription;
  constructor(
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

}
