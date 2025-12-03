import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Invoices</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search invoices..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Create Invoice" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="invoices()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-invoice>
            <tr>
              <td><strong>{{ invoice.invoiceNo }}</strong></td>
              <td>{{ invoice.date }}</td>
              <td>{{ invoice.customer }}</td>
              <td>₹{{ invoice.amount | number:'1.2-2' }}</td>
              <td>₹{{ invoice.tax | number:'1.2-2' }}</td>
              <td><strong>₹{{ invoice.total | number:'1.2-2' }}</strong></td>
              <td>
                <p-tag 
                  [value]="invoice.status" 
                  [severity]="invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-print" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-file text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No invoices found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Create Invoice"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Customer</label>
            <input pInputText class="w-full" placeholder="Select customer" />
          </div>
          <div class="form-field">
            <label class="required">Invoice Date</label>
            <input pInputText type="date" class="w-full" />
          </div>
          <div class="form-field">
            <label>Sales Order Reference</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Due Date</label>
            <input pInputText type="date" class="w-full" />
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
export class InvoicesComponent implements OnInit {
  invoices = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoices.set([
      { id: 1, invoiceNo: 'INV-2024-001', date: '2024-01-15', customer: 'ABC Industries', amount: 50000, tax: 9000, total: 59000, status: 'Paid' },
      { id: 2, invoiceNo: 'INV-2024-002', date: '2024-01-16', customer: 'XYZ Corp', amount: 75000, tax: 13500, total: 88500, status: 'Pending' },
      { id: 3, invoiceNo: 'INV-2024-003', date: '2024-01-10', customer: 'Tech Solutions', amount: 25000, tax: 4500, total: 29500, status: 'Overdue' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

