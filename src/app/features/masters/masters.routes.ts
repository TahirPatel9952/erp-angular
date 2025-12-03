import { Routes } from '@angular/router';

export const MASTERS_ROUTES: Routes = [
  { path: '', redirectTo: 'units', pathMatch: 'full' },
  { path: 'units', loadComponent: () => import('./units/units.component').then(m => m.UnitsComponent) },
  { path: 'categories', loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent) },
  { path: 'warehouses', loadComponent: () => import('./warehouses/warehouses.component').then(m => m.WarehousesComponent) },
  { path: 'suppliers', loadComponent: () => import('./suppliers/suppliers.component').then(m => m.SuppliersComponent) },
  { path: 'customers', loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent) },
];

