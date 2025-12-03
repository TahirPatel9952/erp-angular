import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-gst-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule, DropdownModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>GST Reports</h1>
        <div class="header-actions">
          <button pButton label="GSTR-1" icon="pi pi-file" class="p-button-outlined"></button>
          <button pButton label="GSTR-3B" icon="pi pi-file" class="p-button-outlined"></button>
          <button pButton label="Export" icon="pi pi-download" class="p-button-success"></button>
        </div>
      </div>

      <div class="report-cards">
        <p-card header="Output GST (Sales)" styleClass="report-card">
          <div class="report-stat">
            <span class="label">CGST</span>
            <span class="value">₹{{ gstSummary().outputCGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">SGST</span>
            <span class="value">₹{{ gstSummary().outputSGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">IGST</span>
            <span class="value">₹{{ gstSummary().outputIGST | number:'1.0-0' }}</span>
          </div>
        </p-card>

        <p-card header="Input GST (Purchase)" styleClass="report-card">
          <div class="report-stat">
            <span class="label">CGST</span>
            <span class="value">₹{{ gstSummary().inputCGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">SGST</span>
            <span class="value">₹{{ gstSummary().inputSGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">IGST</span>
            <span class="value">₹{{ gstSummary().inputIGST | number:'1.0-0' }}</span>
          </div>
        </p-card>

        <p-card header="Net GST Liability" styleClass="report-card">
          <div class="report-stat">
            <span class="label">CGST Payable</span>
            <span class="value">₹{{ gstSummary().netCGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">SGST Payable</span>
            <span class="value">₹{{ gstSummary().netSGST | number:'1.0-0' }}</span>
          </div>
          <div class="report-stat">
            <span class="label">IGST Payable</span>
            <span class="value">₹{{ gstSummary().netIGST | number:'1.0-0' }}</span>
          </div>
        </p-card>
      </div>

      <div class="card mt-4">
        <h3>HSN Summary</h3>
        <p-table [value]="hsnData()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>HSN Code</th>
              <th>Description</th>
              <th>Taxable Value</th>
              <th>CGST</th>
              <th>SGST</th>
              <th>IGST</th>
              <th>Total Tax</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td><strong>{{ item.hsnCode }}</strong></td>
              <td>{{ item.description }}</td>
              <td>₹{{ item.taxableValue | number:'1.0-0' }}</td>
              <td>₹{{ item.cgst | number:'1.0-0' }}</td>
              <td>₹{{ item.sgst | number:'1.0-0' }}</td>
              <td>₹{{ item.igst | number:'1.0-0' }}</td>
              <td><strong>₹{{ item.totalTax | number:'1.0-0' }}</strong></td>
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
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  `],
})
export class GstReportsComponent implements OnInit {
  gstSummary = signal({
    outputCGST: 0, outputSGST: 0, outputIGST: 0,
    inputCGST: 0, inputSGST: 0, inputIGST: 0,
    netCGST: 0, netSGST: 0, netIGST: 0
  });
  hsnData = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.gstSummary.set({
      outputCGST: 425000, outputSGST: 425000, outputIGST: 150000,
      inputCGST: 160000, inputSGST: 160000, inputIGST: 80000,
      netCGST: 265000, netSGST: 265000, netIGST: 70000
    });
    this.hsnData.set([
      { hsnCode: '8501', description: 'Electric Motors', taxableValue: 2500000, cgst: 225000, sgst: 225000, igst: 0, totalTax: 450000 },
      { hsnCode: '8483', description: 'Gear Boxes', taxableValue: 1500000, cgst: 135000, sgst: 135000, igst: 0, totalTax: 270000 },
      { hsnCode: '8482', description: 'Bearings', taxableValue: 500000, cgst: 45000, sgst: 45000, igst: 0, totalTax: 90000 },
    ]);
  }
}

