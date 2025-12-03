import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inventory-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Inventory Reports</h1>
        <div class="header-actions">
          <button pButton label="Export Excel" icon="pi pi-file-excel" class="p-button-success"></button>
          <button pButton label="Export PDF" icon="pi pi-file-pdf" class="p-button-danger"></button>
        </div>
      </div>

      <div class="report-cards">
        <p-card header="Stock Summary" styleClass="report-card">
          <div class="report-stat">
            <span class="label">Total Items</span>
            <span class="value">{{ stockSummary().totalItems }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Total Value</span>
            <span class="value">₹{{ stockSummary().totalValue | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat warning">
            <span class="label">Low Stock Items</span>
            <span class="value">{{ stockSummary().lowStock }}</span>
          </div>
        </p-card>

        <p-card header="Movement Summary" styleClass="report-card">
          <div class="report-stat">
            <span class="label">Items Received</span>
            <span class="value">{{ movementSummary().received }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Items Issued</span>
            <span class="value">{{ movementSummary().issued }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Adjustments</span>
            <span class="value">{{ movementSummary().adjustments }}</span>
          </div>
        </p-card>
      </div>

      <div class="card mt-4">
        <h3>Stock Aging Report</h3>
        <p-table [value]="agingData()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>0-30 Days</th>
              <th>31-60 Days</th>
              <th>61-90 Days</th>
              <th>90+ Days</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.days0_30 }}</td>
              <td>{{ item.days31_60 }}</td>
              <td>{{ item.days61_90 }}</td>
              <td [class.text-error]="item.days90Plus > 0">{{ item.days90Plus }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    .report-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .report-stat {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--surface-border);
    }
    .report-stat:last-child {
      border-bottom: none;
    }
    .report-stat .label {
      color: var(--text-color-secondary);
    }
    .report-stat .value {
      font-weight: 600;
    }
    .report-stat.warning .value {
      color: var(--orange-500);
    }
  `],
})
export class InventoryReportsComponent implements OnInit {
  stockSummary = signal({ totalItems: 0, totalValue: 0, lowStock: 0 });
  movementSummary = signal({ received: 0, issued: 0, adjustments: 0 });
  agingData = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.stockSummary.set({ totalItems: 1250, totalValue: 4500000, lowStock: 23 });
    this.movementSummary.set({ received: 450, issued: 380, adjustments: 15 });
    this.agingData.set([
      { name: 'Steel Rod 10mm', category: 'Metals', quantity: 500, days0_30: 300, days31_60: 150, days61_90: 50, days90Plus: 0 },
      { name: 'Copper Wire', category: 'Metals', quantity: 200, days0_30: 100, days31_60: 50, days61_90: 30, days90Plus: 20 },
      { name: 'Plastic Granules', category: 'Plastics', quantity: 350, days0_30: 200, days31_60: 100, days61_90: 50, days90Plus: 0 },
    ]);
  }
}

