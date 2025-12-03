import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Units of Measurement</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add Unit" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="units()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-unit>
            <tr>
              <td><strong>{{ unit.code }}</strong></td>
              <td>{{ unit.name }}</td>
              <td>{{ unit.symbol }}</td>
              <td>{{ unit.type }}</td>
              <td>
                <p-tag 
                  [value]="unit.isActive ? 'Active' : 'Inactive'" 
                  [severity]="unit.isActive ? 'success' : 'danger'"
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
                <i class="pi pi-bookmark text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No units found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Unit"
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
          <div class="form-field">
            <label>Symbol</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label>Type</label>
            <input pInputText class="w-full" placeholder="Weight/Length/Volume" />
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
export class UnitsComponent implements OnInit {
  units = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.units.set([
      { id: 1, code: 'KG', name: 'Kilogram', symbol: 'kg', type: 'Weight', isActive: true },
      { id: 2, code: 'MTR', name: 'Meter', symbol: 'm', type: 'Length', isActive: true },
      { id: 3, code: 'PCS', name: 'Pieces', symbol: 'pcs', type: 'Count', isActive: true },
      { id: 4, code: 'LTR', name: 'Liter', symbol: 'L', type: 'Volume', isActive: true },
      { id: 5, code: 'BOX', name: 'Box', symbol: 'box', type: 'Count', isActive: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

