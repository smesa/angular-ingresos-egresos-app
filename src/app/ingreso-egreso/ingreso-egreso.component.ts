import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { TitleCasePipe } from '@angular/common';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as uiActions from '../shared/ui.actions';
import { stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo = 'ingreso';
  isLoading = false;
  loadingSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private titleCasePipe: TitleCasePipe,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.loadingSubscription = this.store.select('ui').subscribe(ui => this.isLoading = ui.isLoading);
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', [Validators.required]],
    });

  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  guardar(): void {

    if (this.ingresoForm.invalid) { return; }

    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo, '');

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Exito', `${this.titleCasePipe.transform(this.tipo)} agregado`, 'success');
      this.ingresoForm.reset();
    }).catch(err => {
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Ups', err.message, 'error');
    });
  }

}
