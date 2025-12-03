import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Suppliers</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search suppliers..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add Supplier" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="suppliers()" 
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-supplier>
            <tr>
              <td><strong>{{ supplier.code }}</strong></td>
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.contact }}</td>
              <td>{{ supplier.phone }}</td>
              <td>{{ supplier.gstin }}</td>
              <td>
                <p-tag 
                  [value]="supplier.isActive ? 'Active' : 'Inactive'" 
                  [severity]="supplier.isActive ? 'success' : 'danger'"
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
              <td colspan="7" class="text-center py-4">
                <i class="pi pi-users text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No suppliers found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Supplier"
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
export class SuppliersComponent implements OnInit {
  suppliers = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.suppliers.set([
      { id: 1, code: 'SUP-001', name: 'Steel India Ltd', contact: 'Ramesh Kumar', phone: '9876543210', gstin: '27AABCU9603R1ZM', isActive: true },
      { id: 2, code: 'SUP-002', name: 'Plastic World', contact: 'Sunil Sharma', phone: '9876543211', gstin: '27AABCU9603R1ZN', isActive: true },
      { id: 3, code: 'SUP-003', name: 'Electric Components', contact: 'Priya Patel', phone: '9876543212', gstin: '27AABCU9603R1ZO', isActive: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

