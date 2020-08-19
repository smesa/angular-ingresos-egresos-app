import { createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import * as ingresoEgresoActions from './ingreso-egreso.actions';
import { unSetItems } from './ingreso-egreso.actions';


export interface State {
  items: IngresoEgreso[]
}

export const initialState: State = {
  items: []
};


const _ingresoEgresoReducer = createReducer(initialState,
  on(ingresoEgresoActions.setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(ingresoEgresoActions.unSetItems, (state) => ({ ...state, items: [] }))
);

export function ingresoEgresoReducer(state, action) {
  return _ingresoEgresoReducer(state, action);
}



