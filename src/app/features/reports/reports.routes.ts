import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'inventory', loadComponent: () => import('./inventory-reports/inventory-reports.component').then(m => m.InventoryReportsComponent) },
  { path: 'sales', loadComponent: () => import('./sales-reports/sales-reports.component').then(m => m.SalesReportsComponent) },
  { path: 'purchase', loadComponent: () => import('./purchase-reports/purchase-reports.component').then(m => m.PurchaseReportsComponent) },
  { path: 'gst', loadComponent: () => import('./gst-reports/gst-reports.component').then(m => m.GstReportsComponent) },
];

