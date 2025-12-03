import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-finished-goods',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Finished Goods</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="goods()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th>In Stock</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td><strong>{{ item.sku }}</strong></td>
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.warehouse }}</td>
              <td>{{ item.inStock }}</td>
              <td>{{ item.reserved }}</td>
              <td [class.text-error]="item.available < 10">{{ item.available }}</td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-box text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No finished goods found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  `],
})
export class FinishedGoodsComponent implements OnInit {
  goods = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadGoods();
  }

  loadGoods(): void {
    this.goods.set([
      { id: 1, sku: 'FG-001', name: 'Motor Assembly A', category: 'Motors', warehouse: 'Main', inStock: 150, reserved: 30, available: 120 },
      { id: 2, sku: 'FG-002', name: 'Gear Box Standard', category: 'Gear Boxes', warehouse: 'Main', inStock: 80, reserved: 20, available: 60 },
      { id: 3, sku: 'FG-003', name: 'Shaft Assembly', category: 'Shafts', warehouse: 'Warehouse B', inStock: 25, reserved: 20, available: 5 },
    ]);
  }
}

