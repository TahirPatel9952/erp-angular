import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Bill of Materials</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search BOMs..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Create BOM" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="boms()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>BOM Code</th>
              <th>Product</th>
              <th>Version</th>
              <th>Components</th>
              <th>Unit Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-bom>
            <tr>
              <td><strong>{{ bom.code }}</strong></td>
              <td>{{ bom.product }}</td>
              <td>v{{ bom.version }}</td>
              <td>{{ bom.componentCount }} items</td>
              <td>₹{{ bom.unitCost | number:'1.2-2' }}</td>
              <td>
                <p-tag 
                  [value]="bom.status" 
                  [severity]="bom.status === 'Active' ? 'success' : bom.status === 'Draft' ? 'warning' : 'danger'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-copy" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-4">
                <i class="pi pi-sitemap text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No BOMs found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Create Bill of Materials"
        [modal]="true"
        [style]="{width: '600px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Product</label>
            <input pInputText class="w-full" placeholder="Select product" />
          </div>
          <div class="form-field">
            <label class="required">Version</label>
            <input pInputText class="w-full" value="1.0" />
          </div>
          <div class="form-field full-width">
            <label>Description</label>
            <input pInputText class="w-full" />
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
export class BomComponent implements OnInit {
  boms = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadBoms();
  }

  loadBoms(): void {
    this.boms.set([
      { id: 1, code: 'BOM-001', product: 'Motor Assembly A', version: '1.2', componentCount: 15, unitCost: 2500, status: 'Active' },
      { id: 2, code: 'BOM-002', product: 'Gear Box Standard', version: '2.0', componentCount: 22, unitCost: 4800, status: 'Active' },
      { id: 3, code: 'BOM-003', product: 'Shaft Assembly', version: '1.0', componentCount: 8, unitCost: 850, status: 'Draft' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

