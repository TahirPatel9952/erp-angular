import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-in-process',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>In-Process Inventory</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="items()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Work Order</th>
              <th>Product</th>
              <th>Stage</th>
              <th>Quantity</th>
              <th>Started</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td><strong>{{ item.workOrder }}</strong></td>
              <td>{{ item.product }}</td>
              <td>{{ item.stage }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.startDate }}</td>
              <td>
                <p-tag 
                  [value]="item.status" 
                  [severity]="item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'warning' : 'info'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-4">
                <i class="pi pi-cog text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No in-process inventory found</p>
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
export class InProcessComponent implements OnInit {
  items = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.items.set([
      { id: 1, workOrder: 'WO-2024-001', product: 'Motor Assembly', stage: 'Assembly', quantity: 50, startDate: '2024-01-15', status: 'In Progress' },
      { id: 2, workOrder: 'WO-2024-002', product: 'Gear Box', stage: 'Machining', quantity: 30, startDate: '2024-01-14', status: 'In Progress' },
      { id: 3, workOrder: 'WO-2024-003', product: 'Shaft', stage: 'Quality Check', quantity: 100, startDate: '2024-01-13', status: 'Pending QC' },
    ]);
  }
}

