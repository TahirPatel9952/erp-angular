import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, TimelineModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Production Tracking</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search by work order..." [(ngModel)]="searchTerm" />
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
              <th>Work Order</th>
              <th>Product</th>
              <th>Current Stage</th>
              <th>Operator</th>
              <th>Started At</th>
              <th>Completed Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td><strong>{{ item.workOrder }}</strong></td>
              <td>{{ item.product }}</td>
              <td>{{ item.currentStage }}</td>
              <td>{{ item.operator }}</td>
              <td>{{ item.startedAt }}</td>
              <td>{{ item.completedQty }} / {{ item.totalQty }}</td>
              <td>
                <p-tag 
                  [value]="item.status" 
                  [severity]="item.status === 'Running' ? 'success' : item.status === 'Paused' ? 'warning' : 'info'"
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
                <i class="pi pi-clock text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No active production found</p>
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
export class TrackingComponent implements OnInit {
  trackingData = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadTrackingData();
  }

  loadTrackingData(): void {
    this.trackingData.set([
      { id: 1, workOrder: 'WO-2024-001', product: 'Motor Assembly A', currentStage: 'Assembly', operator: 'Ramesh K', startedAt: '2024-01-15 08:00', completedQty: 75, totalQty: 100, status: 'Running' },
      { id: 2, workOrder: 'WO-2024-002', product: 'Gear Box Standard', currentStage: 'Quality Check', operator: 'Sunil S', startedAt: '2024-01-14 09:30', completedQty: 50, totalQty: 50, status: 'Running' },
      { id: 3, workOrder: 'WO-2024-003', product: 'Shaft Assembly', currentStage: 'Machining', operator: 'Amit P', startedAt: '2024-01-20 07:00', completedQty: 0, totalQty: 200, status: 'Paused' },
    ]);
  }
}

