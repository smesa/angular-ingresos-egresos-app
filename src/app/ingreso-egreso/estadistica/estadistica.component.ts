import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { MultiDataSet, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresosEgresosSubcription: Subscription;
  ingresos = 0;
  egresos = 0;

  totalEgresos = 0;
  totalIngresos = 0;

  doughnutChartLabels: Label[] = ['Ingreso', 'Egresos'];
  doughnutChartData: MultiDataSet = [
    []
  ];

  constructor(
    private store: Store<AppStateWithIngreso>
  ) {
  }

  ngOnInit(): void {
    this.ingresosEgresosSubcription = this.store.select('ingresosEgresos').subscribe((ingresosEgresos) => {
      this.generarEstadistica(ingresosEgresos.items);
    });
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubcription.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]): void {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalEgresos = 0;
    this.totalIngresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }

}
