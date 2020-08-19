import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubcription: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.ingresosEgresosSubcription = this.store.select('ingresosEgresos').subscribe(ingresosEgresos => {
      this.ingresosEgresos = ingresosEgresos.items;
    });
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubcription.unsubscribe();
  }

  borrar(uid: string): void {
    this.ingresoEgresoService.borrarIngresoEgreso(uid).then(() => {
      Swal.fire('Borrado', 'El elemento fue eliminado con exito', 'success');
    }).catch(err => {
      Swal.fire('Error', err.message, 'error');
    });
  }

}
