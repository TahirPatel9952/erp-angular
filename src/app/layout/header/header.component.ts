import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule, AvatarModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()">
          <i class="pi pi-bars"></i>
        </button>
        <div class="search-container">
          <i class="pi pi-search"></i>
          <input type="text" placeholder="Search..." class="search-input" />
        </div>
      </div>
      
      <div class="header-right">
        <button class="icon-button">
          <i class="pi pi-bell"></i>
          <span class="notification-badge">3</span>
        </button>
        
        <div class="user-menu">
          <button class="user-button" (click)="menu.toggle($event)">
            <p-avatar 
              [label]="userInitials" 
              shape="circle" 
              size="normal"
              styleClass="user-avatar"
            />
            <span class="user-name">{{ userName }}</span>
            <i class="pi pi-chevron-down"></i>
          </button>
          
          <p-menu #menu [model]="menuItems" [popup]="true" appendTo="body" />
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      height: var(--header-height);
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 100;
      transition: left 0.3s ease;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      color: var(--text-secondary);
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      i {
        font-size: 1.25rem;
      }
    }

    .search-container {
      position: relative;
      
      i {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
      }
    }

    .search-input {
      padding: 0.5rem 0.75rem 0.5rem 2.25rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      width: 280px;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-button {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      color: var(--text-secondary);
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      i {
        font-size: 1.25rem;
      }
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--error-color);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 9999px;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }
    }

    .user-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    :host ::ng-deep .user-avatar {
      background: var(--primary-color);
      color: white;
    }

    @media (max-width: 768px) {
      .header {
        left: 0;
      }
      
      .search-container {
        display: none;
      }
      
      .user-name {
        display: none;
      }
    }
  `],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/settings/profile']),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.router.navigate(['/settings']),
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authService.logout(),
    },
  ];

  get userName(): string {
    return this.authService.currentUser()?.fullName || 'User';
  }

  get userInitials(): string {
    const user = this.authService.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'U';
  }
}

