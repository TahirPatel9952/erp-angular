import { Routes } from '@angular/router';

export const INVOICING_ROUTES: Routes = [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  { path: 'invoices', loadComponent: () => import('./invoices/invoices.component').then(m => m.InvoicesComponent) },
  { path: 'payments', loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent) },
];

