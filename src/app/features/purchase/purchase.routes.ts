import { Routes } from '@angular/router';

export const PURCHASE_ROUTES: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', loadComponent: () => import('./orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent) },
  { path: 'grn', loadComponent: () => import('./grn/grn.component').then(m => m.GrnComponent) },
];

