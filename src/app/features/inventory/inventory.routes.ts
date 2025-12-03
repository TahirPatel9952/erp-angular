import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  { path: '', redirectTo: 'raw-materials', pathMatch: 'full' },
  { path: 'raw-materials', loadComponent: () => import('./raw-materials/raw-materials.component').then(m => m.RawMaterialsComponent) },
  { path: 'in-process', loadComponent: () => import('./in-process/in-process.component').then(m => m.InProcessComponent) },
  { path: 'finished-goods', loadComponent: () => import('./finished-goods/finished-goods.component').then(m => m.FinishedGoodsComponent) },
  { path: 'stock-adjustment', loadComponent: () => import('./stock-adjustment/stock-adjustment.component').then(m => m.StockAdjustmentComponent) },
];

