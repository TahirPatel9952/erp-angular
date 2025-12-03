import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule, ProgressBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Work Orders</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search work orders..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Create Work Order" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="workOrders()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Work Order</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Start Date</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-wo>
            <tr>
              <td><strong>{{ wo.woNumber }}</strong></td>
              <td>{{ wo.product }}</td>
              <td>{{ wo.quantity }}</td>
              <td>{{ wo.startDate }}</td>
              <td>{{ wo.dueDate }}</td>
              <td style="width: 150px">
                <p-progressBar [value]="wo.progress" [showValue]="true"></p-progressBar>
              </td>
              <td>
                <p-tag 
                  [value]="wo.status" 
                  [severity]="wo.status === 'Completed' ? 'success' : wo.status === 'In Progress' ? 'warning' : 'info'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-wrench text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No work orders found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Create Work Order"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Product</label>
            <input pInputText class="w-full" placeholder="Select product" />
          </div>
          <div class="form-field">
            <label class="required">Quantity</label>
            <input pInputText type="number" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Start Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Due Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field full-width">
            <label>Sales Order Reference</label>
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
export class WorkOrdersComponent implements OnInit {
  workOrders = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  loadWorkOrders(): void {
    this.workOrders.set([
      { id: 1, woNumber: 'WO-2024-001', product: 'Motor Assembly A', quantity: 100, startDate: '2024-01-15', dueDate: '2024-01-25', progress: 75, status: 'In Progress' },
      { id: 2, woNumber: 'WO-2024-002', product: 'Gear Box Standard', quantity: 50, startDate: '2024-01-14', dueDate: '2024-01-24', progress: 100, status: 'Completed' },
      { id: 3, woNumber: 'WO-2024-003', product: 'Shaft Assembly', quantity: 200, startDate: '2024-01-20', dueDate: '2024-01-30', progress: 0, status: 'Planned' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

