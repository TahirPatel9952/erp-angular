import { Routes } from '@angular/router';

export const PRODUCTION_ROUTES: Routes = [
  { path: '', redirectTo: 'work-orders', pathMatch: 'full' },
  { path: 'bom', loadComponent: () => import('./bom/bom.component').then(m => m.BomComponent) },
  { path: 'work-orders', loadComponent: () => import('./work-orders/work-orders.component').then(m => m.WorkOrdersComponent) },
  { path: 'tracking', loadComponent: () => import('./tracking/tracking.component').then(m => m.TrackingComponent) },
];

