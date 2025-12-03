import { Routes } from '@angular/router';

export const DELIVERY_ROUTES: Routes = [
  { path: '', redirectTo: 'challans', pathMatch: 'full' },
  { path: 'challans', loadComponent: () => import('./challans/challans.component').then(m => m.ChallansComponent) },
  { path: 'dispatch', loadComponent: () => import('./dispatch/dispatch.component').then(m => m.DispatchComponent) },
];

