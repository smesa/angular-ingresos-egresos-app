import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';

export const setUser = createAction(
  '[Auth Component] SetUser',
  props<{ user: Usuario }>()
);

export const unSetUser = createAction(
  '[Auth Component] UnSetUser'
);
