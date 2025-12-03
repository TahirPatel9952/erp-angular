import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sales Orders</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search orders..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Create Order" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="salesOrders()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Order No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-order>
            <tr>
              <td><strong>{{ order.orderNo }}</strong></td>
              <td>{{ order.date }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.itemCount }} items</td>
              <td><strong>₹{{ order.total | number:'1.2-2' }}</strong></td>
              <td>{{ order.deliveryDate }}</td>
              <td>
                <p-tag 
                  [value]="order.status" 
                  [severity]="order.status === 'Delivered' ? 'success' : order.status === 'In Production' ? 'warning' : 'info'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-print" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-shopping-bag text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No sales orders found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Create Sales Order"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Customer</label>
            <input pInputText class="w-full" placeholder="Select customer" />
          </div>
          <div class="form-field">
            <label class="required">Order Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Delivery Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field">
            <label>Payment Terms</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Create"></button>
        </ng-template>
      </p-dialog>
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
export class SalesOrdersComponent implements OnInit {
  salesOrders = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.salesOrders.set([
      { id: 1, orderNo: 'SO-2024-001', date: '2024-01-15', customer: 'ABC Industries', itemCount: 5, total: 125000, deliveryDate: '2024-01-25', status: 'Delivered' },
      { id: 2, orderNo: 'SO-2024-002', date: '2024-01-16', customer: 'XYZ Corp', itemCount: 3, total: 85000, deliveryDate: '2024-01-26', status: 'In Production' },
      { id: 3, orderNo: 'SO-2024-003', date: '2024-01-17', customer: 'Tech Solutions', itemCount: 8, total: 210000, deliveryDate: '2024-01-30', status: 'Confirmed' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

