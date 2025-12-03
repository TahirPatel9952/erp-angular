import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule, CheckboxModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Roles & Permissions</h1>
        <div class="header-actions">
          <button pButton label="Add Role" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="roles()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Users</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-role>
            <tr>
              <td><strong>{{ role.name }}</strong></td>
              <td>{{ role.description }}</td>
              <td>{{ role.userCount }} users</td>
              <td>{{ role.permissionCount }} permissions</td>
              <td>
                <p-tag 
                  [value]="role.isActive ? 'Active' : 'Inactive'" 
                  [severity]="role.isActive ? 'success' : 'danger'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-shield" class="p-button-text p-button-sm" pTooltip="Manage Permissions"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" [disabled]="role.isSystem"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-4">
                <i class="pi pi-shield text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No roles found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add Role"
        [modal]="true"
        [style]="{width: '500px'}"
      >
        <div class="form-grid">
          <div class="form-field full-width">
            <label class="required">Role Name</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field full-width">
            <label>Description</label>
            <input pInputText class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Create Role"></button>
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
export class RolesComponent implements OnInit {
  roles = signal<any[]>([]);
  dialogVisible = false;

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roles.set([
      { id: 1, name: 'Administrator', description: 'Full system access', userCount: 2, permissionCount: 45, isActive: true, isSystem: true },
      { id: 2, name: 'Production Manager', description: 'Manage production operations', userCount: 3, permissionCount: 25, isActive: true, isSystem: false },
      { id: 3, name: 'Sales Executive', description: 'Manage sales and customers', userCount: 5, permissionCount: 18, isActive: true, isSystem: false },
      { id: 4, name: 'Store Keeper', description: 'Manage inventory', userCount: 4, permissionCount: 15, isActive: true, isSystem: false },
      { id: 5, name: 'Viewer', description: 'View only access', userCount: 8, permissionCount: 10, isActive: true, isSystem: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

