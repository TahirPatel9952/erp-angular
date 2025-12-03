import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-raw-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Raw Materials</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" (input)="onSearch()" />
          </span>
          <button pButton label="Add Material" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="materials()" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          [rowsPerPageOptions]="[10, 25, 50]"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="code">Code <p-sortIcon field="code" /></th>
              <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
              <th>Category</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th style="width: 120px">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-material>
            <tr>
              <td><strong>{{ material.code }}</strong></td>
              <td>{{ material.name }}</td>
              <td>{{ material.category }}</td>
              <td>{{ material.unit }}</td>
              <td [class.text-error]="material.stock < material.reorderLevel">
                {{ material.stock }}
              </td>
              <td>{{ material.reorderLevel }}</td>
              <td>
                <p-tag 
                  [value]="material.isActive ? 'Active' : 'Inactive'" 
                  [severity]="material.isActive ? 'success' : 'danger'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="editMaterial(material)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="deleteMaterial(material)"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-4">
                <i class="pi pi-inbox text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No raw materials found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        [header]="isEditing ? 'Edit Raw Material' : 'Add Raw Material'"
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
          <div class="form-field">
            <label>Category</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Unit</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Save" (click)="saveMaterial()"></button>
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
export class RawMaterialsComponent implements OnInit {
  private toastr = inject(ToastrService);

  materials = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    // Mock data - replace with actual API call
    this.materials.set([
      { id: 1, code: 'RM-001', name: 'Steel Rod 10mm', category: 'Metals', unit: 'Kg', stock: 500, reorderLevel: 100, isActive: true },
      { id: 2, code: 'RM-002', name: 'Copper Wire', category: 'Metals', unit: 'Meter', stock: 25, reorderLevel: 50, isActive: true },
      { id: 3, code: 'RM-003', name: 'Plastic Granules', category: 'Plastics', unit: 'Kg', stock: 200, reorderLevel: 150, isActive: true },
      { id: 4, code: 'RM-004', name: 'Bearing SKF', category: 'Components', unit: 'Pcs', stock: 15, reorderLevel: 30, isActive: true },
      { id: 5, code: 'RM-005', name: 'Motor Oil', category: 'Consumables', unit: 'Liter', stock: 10, reorderLevel: 25, isActive: false },
    ]);
  }

  onSearch(): void {
    // Implement search
  }

  showDialog(): void {
    this.isEditing = false;
    this.dialogVisible = true;
  }

  editMaterial(material: any): void {
    this.isEditing = true;
    this.dialogVisible = true;
  }

  saveMaterial(): void {
    this.toastr.success('Material saved successfully');
    this.dialogVisible = false;
  }

  deleteMaterial(material: any): void {
    this.toastr.success('Material deleted successfully');
  }
}

