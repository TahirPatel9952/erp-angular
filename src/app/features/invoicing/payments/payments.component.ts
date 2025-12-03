import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Payments</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search payments..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Record Payment" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="payments()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-payment>
            <tr>
              <td><strong>{{ payment.paymentId }}</strong></td>
              <td>{{ payment.date }}</td>
              <td>{{ payment.invoice }}</td>
              <td>{{ payment.customer }}</td>
              <td><strong>₹{{ payment.amount | number:'1.2-2' }}</strong></td>
              <td>{{ payment.method }}</td>
              <td>
                <p-tag 
                  [value]="payment.status" 
                  [severity]="payment.status === 'Completed' ? 'success' : 'warning'"
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
                <i class="pi pi-wallet text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No payments found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Record Payment"
        [modal]="true"
        [style]="{width: '500px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Invoice</label>
            <input pInputText class="w-full" placeholder="Select invoice" />
          </div>
          <div class="form-field">
            <label class="required">Amount</label>
            <input pInputText type="number" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Payment Method</label>
            <input pInputText class="w-full" placeholder="Cash/Bank/UPI" />
          </div>
          <div class="form-field">
            <label>Reference No</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Record"></button>
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
export class PaymentsComponent implements OnInit {
  payments = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.payments.set([
      { id: 1, paymentId: 'PAY-001', date: '2024-01-15', invoice: 'INV-2024-001', customer: 'ABC Industries', amount: 59000, method: 'Bank Transfer', status: 'Completed' },
      { id: 2, paymentId: 'PAY-002', date: '2024-01-16', invoice: 'INV-2024-002', customer: 'XYZ Corp', amount: 50000, method: 'Cheque', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

