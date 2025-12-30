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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
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
