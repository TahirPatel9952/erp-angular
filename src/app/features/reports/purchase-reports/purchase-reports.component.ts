import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-purchase-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Purchase Reports</h1>
        <div class="header-actions">
          <button pButton label="Export Excel" icon="pi pi-file-excel" class="p-button-success"></button>
          <button pButton label="Export PDF" icon="pi pi-file-pdf" class="p-button-danger"></button>
        </div>
      </div>

      <div class="report-cards">
        <p-card header="Purchase Summary" styleClass="report-card">
          <div class="report-stat">
            <span class="label">Total POs</span>
            <span class="value">{{ purchaseSummary().totalPOs }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Total Value</span>
            <span class="value">₹{{ purchaseSummary().totalValue | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Pending Deliveries</span>
            <span class="value">{{ purchaseSummary().pending }}</span>
          </div>
        </p-card>

        <p-card header="Payment Summary" styleClass="report-card">
          <div class="report-stat">
            <span class="label">Total Payable</span>
            <span class="value">₹{{ paymentSummary().payable | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">Paid</span>
            <span class="value">₹{{ paymentSummary().paid | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat warning">
            <span class="label">Outstanding</span>
            <span class="value">₹{{ paymentSummary().outstanding | number:'1.0-0' }}</span>
          </div>
        </p-card>
      </div>

      <div class="card mt-4">
        <h3>Top Suppliers</h3>
        <p-table [value]="topSuppliers()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Rank</th>
              <th>Supplier</th>
              <th>Orders</th>
              <th>Value</th>
              <th>Outstanding</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-supplier let-i="rowIndex">
            <tr>
              <td><strong>#{{ i + 1 }}</strong></td>
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.orders }}</td>
              <td>₹{{ supplier.value | number:'1.0-0' }}</td>
              <td>₹{{ supplier.outstanding | number:'1.0-0' }}</td>
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
export class PurchaseReportsComponent implements OnInit {
  purchaseSummary = signal({ totalPOs: 0, totalValue: 0, pending: 0 });
  paymentSummary = signal({ payable: 0, paid: 0, outstanding: 0 });
  topSuppliers = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.purchaseSummary.set({ totalPOs: 89, totalValue: 3200000, pending: 12 });
    this.paymentSummary.set({ payable: 3200000, paid: 2800000, outstanding: 400000 });
    this.topSuppliers.set([
      { name: 'Steel India Ltd', orders: 25, value: 1200000, outstanding: 150000 },
      { name: 'Plastic World', orders: 20, value: 800000, outstanding: 100000 },
      { name: 'Electric Components', orders: 18, value: 600000, outstanding: 50000 },
      { name: 'Metal Works', orders: 15, value: 400000, outstanding: 50000 },
      { name: 'Industrial Supplies', orders: 11, value: 200000, outstanding: 50000 },
    ]);
  }
}

