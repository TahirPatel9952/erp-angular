import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Purchase Orders</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search POs..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Create PO" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="purchaseOrders()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>PO Number</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Total</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-po>
            <tr>
              <td><strong>{{ po.poNumber }}</strong></td>
              <td>{{ po.date }}</td>
              <td>{{ po.supplier }}</td>
              <td>{{ po.itemCount }} items</td>
              <td><strong>₹{{ po.total | number:'1.2-2' }}</strong></td>
              <td>{{ po.deliveryDate }}</td>
              <td>
                <p-tag 
                  [value]="po.status" 
                  [severity]="po.status === 'Received' ? 'success' : po.status === 'Partial' ? 'warning' : 'info'"
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
                <i class="pi pi-shopping-cart text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No purchase orders found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Create Purchase Order"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Supplier</label>
            <input pInputText class="w-full" placeholder="Select supplier" />
          </div>
          <div class="form-field">
            <label class="required">Order Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Expected Delivery</label>
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
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.purchaseOrders.set([
      { id: 1, poNumber: 'PO-2024-001', date: '2024-01-10', supplier: 'Steel India Ltd', itemCount: 5, total: 125000, deliveryDate: '2024-01-20', status: 'Received' },
      { id: 2, poNumber: 'PO-2024-002', date: '2024-01-12', supplier: 'Plastic World', itemCount: 3, total: 45000, deliveryDate: '2024-01-22', status: 'Partial' },
      { id: 3, poNumber: 'PO-2024-003', date: '2024-01-15', supplier: 'Electric Components', itemCount: 8, total: 78000, deliveryDate: '2024-01-25', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

