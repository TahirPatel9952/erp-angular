import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', loadComponent: () => import('./orders/sales-orders.component').then(m => m.SalesOrdersComponent) },
  { path: 'tracking', loadComponent: () => import('./tracking/sales-tracking.component').then(m => m.SalesTrackingComponent) },
];

