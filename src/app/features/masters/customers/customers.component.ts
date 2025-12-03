import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customers</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search customers..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add Customer" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="customers()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Credit Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-customer>
            <tr>
              <td><strong>{{ customer.code }}</strong></td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.contact }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.gstin }}</td>
              <td>₹{{ customer.creditLimit | number:'1.0-0' }}</td>
              <td>
                <p-tag 
                  [value]="customer.isActive ? 'Active' : 'Inactive'" 
                  [severity]="customer.isActive ? 'success' : 'danger'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-user text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No customers found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Customer"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Code</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Name</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Contact Person</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Phone</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Email</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>GSTIN</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Credit Limit</label>
            <input pInputText type="number" class="w-full" />
          </div>
          <div class="form-field full-width">
            <label>Address</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Save"></button>
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
export class CustomersComponent implements OnInit {
  customers = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customers.set([
      { id: 1, code: 'CUS-001', name: 'ABC Industries', contact: 'Vikram Singh', phone: '9876543220', gstin: '27AABCU9603R1ZP', creditLimit: 500000, isActive: true },
      { id: 2, code: 'CUS-002', name: 'XYZ Corp', contact: 'Anita Desai', phone: '9876543221', gstin: '27AABCU9603R1ZQ', creditLimit: 750000, isActive: true },
      { id: 3, code: 'CUS-003', name: 'Tech Solutions', contact: 'Rahul Mehta', phone: '9876543222', gstin: '27AABCU9603R1ZR', creditLimit: 300000, isActive: true },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

