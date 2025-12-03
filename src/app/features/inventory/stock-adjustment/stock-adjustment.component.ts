import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-stock-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Stock Adjustments</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="New Adjustment" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="adjustments()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Adjustment No</th>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-adj>
            <tr>
              <td><strong>{{ adj.adjustmentNo }}</strong></td>
              <td>{{ adj.date }}</td>
              <td>{{ adj.item }}</td>
              <td>
                <p-tag 
                  [value]="adj.type" 
                  [severity]="adj.type === 'Addition' ? 'success' : 'danger'"
                />
              </td>
              <td>{{ adj.quantity }}</td>
              <td>{{ adj.reason }}</td>
              <td>
                <p-tag 
                  [value]="adj.status" 
                  [severity]="adj.status === 'Approved' ? 'success' : 'warning'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-sliders-h text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No adjustments found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="New Stock Adjustment"
        [modal]="true"
        [style]="{width: '500px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Item</label>
            <input pInputText class="w-full" placeholder="Select item" />
          </div>
          <div class="form-field">
            <label class="required">Adjustment Type</label>
            <input pInputText class="w-full" placeholder="Addition/Deduction" />
          </div>
          <div class="form-field">
            <label class="required">Quantity</label>
            <input pInputText type="number" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Reason</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Submit"></button>
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
export class StockAdjustmentComponent implements OnInit {
  adjustments = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadAdjustments();
  }

  loadAdjustments(): void {
    this.adjustments.set([
      { id: 1, adjustmentNo: 'ADJ-001', date: '2024-01-15', item: 'Steel Rod 10mm', type: 'Addition', quantity: 50, reason: 'Stock Count Correction', status: 'Approved' },
      { id: 2, adjustmentNo: 'ADJ-002', date: '2024-01-16', item: 'Copper Wire', type: 'Deduction', quantity: 10, reason: 'Damaged Goods', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

