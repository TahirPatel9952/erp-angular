import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Categories</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add Category" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="categories()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Items Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-category>
            <tr>
              <td><strong>{{ category.code }}</strong></td>
              <td>{{ category.name }}</td>
              <td>{{ category.parent || '-' }}</td>
              <td>{{ category.itemCount }}</td>
              <td>
                <p-tag 
                  [value]="category.isActive ? 'Active' : 'Inactive'" 
                  [severity]="category.isActive ? 'success' : 'danger'"
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
              <td colspan="6" class="text-center py-4">
                <i class="pi pi-tags text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No categories found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Category"
        [modal]="true"
        [style]="{width: '450px'}"
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
            <label>Parent Category</label>
            <input pInputText class="w-full" placeholder="Select parent (optional)" />
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
export class CategoriesComponent implements OnInit {
  categories = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories.set([
      { id: 1, code: 'MTL', name: 'Metals', parent: null, itemCount: 25, isActive: true },
      { id: 2, code: 'PLS', name: 'Plastics', parent: null, itemCount: 15, isActive: true },
      { id: 3, code: 'ELC', name: 'Electronics', parent: null, itemCount: 30, isActive: true },
      { id: 4, code: 'CMP', name: 'Components', parent: null, itemCount: 45, isActive: true },
      { id: 5, code: 'CON', name: 'Consumables', parent: null, itemCount: 20, isActive: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

