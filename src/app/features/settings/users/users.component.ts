import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../../core/services';
import { UserDetails, UserRequest } from '../../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    TagModule, 
    DialogModule,
    DropdownModule,
    PasswordModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private userService = inject(UserService);

  users = signal<UserDetails[]>([]);
  roles: any[] = [];
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  resetPasswordVisible = false;
  selectedUser: UserDetails | null = null;
  newPassword = '';
  rows = 10;
  first = 0;

  userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: [''],
    lastName: [''],
    phone: [''],
    roleId: [null, [Validators.required]],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(event?: any): void {
    this.loading.set(true);
    const page = event?.first ? event.first / event.rows : 0;
    const size = event?.rows || this.rows;
    
    this.userService.getAll({ page, size }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.roles = response.data.map((r: any) => ({ id: r.id, name: r.name }));
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.userService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.users.set(response.data.content);
            this.totalRecords.set(response.data.totalElements);
          }
        }
      });
    } else {
      this.loadUsers();
    }
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedUser = null;
    this.userForm.reset({ isActive: true });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  editUser(user: UserDetails): void {
    this.editMode = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roleId: user.roleId,
      isActive: user.isActive
    });
    // Password not required when editing
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.dialogVisible = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.userForm.value;
    const request: UserRequest = {
      username: formValue.username,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      roleId: formValue.roleId,
      isActive: formValue.isActive
    };

    if (this.editMode && this.selectedUser) {
      this.userService.update(this.selectedUser.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
            this.dialogVisible = false;
            this.loadUsers();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
          this.saving.set(false);
        }
      });
    } else {
      const password = formValue.password || '';
      this.userService.create(request, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
            this.dialogVisible = false;
            this.loadUsers();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user' });
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(user: UserDetails): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.username}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUser(user)
    });
  }

  deleteUser(user: UserDetails): void {
    this.userService.delete(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
          this.loadUsers();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' })
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  showResetPassword(user: UserDetails): void {
    this.selectedUser = user;
    this.newPassword = '';
    this.resetPasswordVisible = true;
  }

  closeResetPasswordDialog(): void {
    this.resetPasswordVisible = false;
    this.newPassword = '';
  }

  resetPassword(): void {
    if (!this.selectedUser || !this.newPassword || this.newPassword.length < 6) {
      return;
    }

    this.saving.set(true);
    this.userService.resetPassword(this.selectedUser.id, this.newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully' });
          this.closeResetPasswordDialog();
        }
        this.saving.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reset password' });
        this.saving.set(false);
      }
    });
  }

  toggleStatus(user: UserDetails): void {
    const action = user.isActive ? 
      this.userService.deactivate(user.id) : 
      this.userService.activate(user.id);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: `User ${user.isActive ? 'deactivated' : 'activated'} successfully` 
          });
          this.loadUsers();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' })
    });
  }

  getRoleSeverity(role: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'SUPERVISOR': return 'info';
      case 'OPERATOR': return 'success';
      default: return 'info';
    }
  }
}
