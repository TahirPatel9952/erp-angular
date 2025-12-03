import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'masters',
        loadChildren: () => import('./features/masters/masters.routes').then(m => m.MASTERS_ROUTES),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
      },
      {
        path: 'production',
        loadChildren: () => import('./features/production/production.routes').then(m => m.PRODUCTION_ROUTES),
      },
      {
        path: 'purchase',
        loadChildren: () => import('./features/purchase/purchase.routes').then(m => m.PURCHASE_ROUTES),
      },
      {
        path: 'sales',
        loadChildren: () => import('./features/sales/sales.routes').then(m => m.SALES_ROUTES),
      },
      {
        path: 'delivery',
        loadChildren: () => import('./features/delivery/delivery.routes').then(m => m.DELIVERY_ROUTES),
      },
      {
        path: 'invoicing',
        loadChildren: () => import('./features/invoicing/invoicing.routes').then(m => m.INVOICING_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

