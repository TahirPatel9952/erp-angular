import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-sales-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, ProgressBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sales Order Tracking</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search by order..." [(ngModel)]="searchTerm" />
          </span>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="trackingData()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Production</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td><strong>{{ item.orderNo }}</strong></td>
              <td>{{ item.customer }}</td>
              <td>{{ item.orderDate }}</td>
              <td>{{ item.deliveryDate }}</td>
              <td style="width: 120px">
                <p-progressBar [value]="item.productionProgress" [showValue]="true"></p-progressBar>
              </td>
              <td style="width: 120px">
                <p-progressBar [value]="item.deliveryProgress" [showValue]="true"></p-progressBar>
              </td>
              <td>
                <p-tag 
                  [value]="item.status" 
                  [severity]="item.status === 'Completed' ? 'success' : item.status === 'Delayed' ? 'danger' : 'warning'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-history" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-map-marker text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No orders to track</p>
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
export class SalesTrackingComponent implements OnInit {
  trackingData = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadTrackingData();
  }

  loadTrackingData(): void {
    this.trackingData.set([
      { id: 1, orderNo: 'SO-2024-001', customer: 'ABC Industries', orderDate: '2024-01-15', deliveryDate: '2024-01-25', productionProgress: 100, deliveryProgress: 100, status: 'Completed' },
      { id: 2, orderNo: 'SO-2024-002', customer: 'XYZ Corp', orderDate: '2024-01-16', deliveryDate: '2024-01-26', productionProgress: 75, deliveryProgress: 0, status: 'In Progress' },
      { id: 3, orderNo: 'SO-2024-003', customer: 'Tech Solutions', orderDate: '2024-01-10', deliveryDate: '2024-01-20', productionProgress: 60, deliveryProgress: 0, status: 'Delayed' },
    ]);
  }
}

