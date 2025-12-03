import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule, AvatarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>User Management</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search users..." [(ngModel)]="searchTerm" />
          </span>
          <button pButton label="Add User" icon="pi pi-plus" (click)="showDialog()"></button>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="users()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>
                <div class="user-info">
                  <p-avatar [label]="user.name.charAt(0)" shape="circle" size="normal"></p-avatar>
                  <span class="ml-2"><strong>{{ user.name }}</strong></span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.department }}</td>
              <td>{{ user.lastLogin }}</td>
              <td>
                <p-tag 
                  [value]="user.isActive ? 'Active' : 'Inactive'" 
                  [severity]="user.isActive ? 'success' : 'danger'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-key" class="p-button-text p-button-sm"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-4">
                <i class="pi pi-users text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No users found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [(visible)]="dialogVisible" 
        header="Add User"
        [modal]="true"
        [style]="{width: '500px'}"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="required">Full Name</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Email</label>
            <input pInputText type="email" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Role</label>
            <input pInputText class="w-full" placeholder="Select role" />
          </div>
          <div class="form-field">
            <label>Department</label>
            <input pInputText class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Password</label>
            <input pInputText type="password" class="w-full" />
          </div>
          <div class="form-field">
            <label class="required">Confirm Password</label>
            <input pInputText type="password" class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" class="p-button-text" (click)="dialogVisible = false"></button>
          <button pButton label="Create User"></button>
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
    .user-info {
      display: flex;
      align-items: center;
    }
  `],
})
export class UsersComponent implements OnInit {
  users = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users.set([
      { id: 1, name: 'Admin User', email: 'admin@company.com', role: 'Administrator', department: 'IT', lastLogin: '2024-01-17 10:30', isActive: true },
      { id: 2, name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'Production Manager', department: 'Production', lastLogin: '2024-01-17 09:15', isActive: true },
      { id: 3, name: 'Priya Sharma', email: 'priya@company.com', role: 'Sales Executive', department: 'Sales', lastLogin: '2024-01-16 17:45', isActive: true },
      { id: 4, name: 'Amit Patel', email: 'amit@company.com', role: 'Store Keeper', department: 'Inventory', lastLogin: '2024-01-15 14:20', isActive: false },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}

