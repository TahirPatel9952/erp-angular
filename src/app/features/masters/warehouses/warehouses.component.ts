import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Warehouses</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add Warehouse" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="warehouses()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-warehouse>
            <tr>
              <td><strong>{{ warehouse.code }}</strong></td>
              <td>{{ warehouse.name }}</td>
              <td>{{ warehouse.location }}</td>
              <td>{{ warehouse.capacity }}</td>
              <td>{{ warehouse.manager }}</td>
              <td>
                <p-tag 
                  [value]="warehouse.isActive ? 'Active' : 'Inactive'" 
                  [severity]="warehouse.isActive ? 'success' : 'danger'"
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
                <i class="pi pi-building text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No warehouses found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Warehouse"
        [modal]="true"
        [style]="{width: '500px'}"
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
          <div class="form-field full-width">
            <label class="required">Location</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Capacity</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Manager</label>
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
export class WarehousesComponent implements OnInit {
  warehouses = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouses.set([
      { id: 1, code: 'WH-MAIN', name: 'Main Warehouse', location: 'Mumbai', capacity: '10000 sq ft', manager: 'Rajesh Kumar', isActive: true },
      { id: 2, code: 'WH-B', name: 'Warehouse B', location: 'Pune', capacity: '5000 sq ft', manager: 'Suresh Patil', isActive: true },
      { id: 3, code: 'WH-C', name: 'Cold Storage', location: 'Mumbai', capacity: '2000 sq ft', manager: 'Amit Shah', isActive: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

