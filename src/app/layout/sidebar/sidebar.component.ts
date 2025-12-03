import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  permission?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <i class="pi pi-building"></i>
          @if (!collapsed) {
            <span class="logo-text">Manufacturing ERP</span>
          }
        </div>
        <button class="collapse-btn" (click)="toggleCollapse.emit()">
          <i [class]="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        @for (item of menuItems; track item.label) {
          @if (!item.permission || hasPermission(item.permission)) {
            <div class="nav-item-container">
              @if (item.children) {
                <button 
                  class="nav-item" 
                  [class.active]="isActive(item)"
                  (click)="toggleExpand(item)"
                >
                  <i [class]="'pi ' + item.icon"></i>
                  @if (!collapsed) {
                    <span class="nav-label">{{ item.label }}</span>
                    <i [class]="item.expanded ? 'pi pi-chevron-down expand-icon' : 'pi pi-chevron-right expand-icon'"></i>
                  }
                </button>
                @if (item.expanded && !collapsed) {
                  <div class="nav-children">
                    @for (child of item.children; track child.label) {
                      @if (!child.permission || hasPermission(child.permission)) {
                        <a 
                          [routerLink]="child.route" 
                          routerLinkActive="active"
                          class="nav-child"
                        >
                          <i [class]="'pi ' + child.icon"></i>
                          <span class="nav-label">{{ child.label }}</span>
                        </a>
                      }
                    }
                  </div>
                }
              } @else {
                <a 
                  [routerLink]="item.route" 
                  routerLinkActive="active"
                  class="nav-item"
                  [title]="collapsed ? item.label : ''"
                >
                  <i [class]="'pi ' + item.icon"></i>
                  @if (!collapsed) {
                    <span class="nav-label">{{ item.label }}</span>
                  }
                </a>
              }
            </div>
          }
        }
      </nav>

      <div class="sidebar-footer">
        @if (!collapsed) {
          <div class="version">v1.0.0</div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: var(--sidebar-width);
      background: linear-gradient(180deg, #1a237e 0%, #0d47a1 100%);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      z-index: 200;
      overflow-x: hidden;

      &.collapsed {
        width: 64px;
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      min-height: var(--header-height);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      i {
        font-size: 1.5rem;
      }
    }

    .logo-text {
      font-weight: 600;
      font-size: 1rem;
      white-space: nowrap;
    }

    .collapse-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.5rem;
      overflow-y: auto;
    }

    .nav-item-container {
      margin-bottom: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-size: 0.875rem;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.active {
        background: rgba(255, 255, 255, 0.15);
        color: white;
      }

      i {
        font-size: 1.125rem;
        min-width: 1.25rem;
      }
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
    }

    .expand-icon {
      font-size: 0.75rem;
    }

    .nav-children {
      padding-left: 1rem;
      margin-top: 0.25rem;
    }

    .nav-child {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
      font-size: 0.8125rem;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.active {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      i {
        font-size: 0.875rem;
      }
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .version {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .sidebar.collapsed {
      .sidebar-header {
        justify-content: center;
        padding: 1rem 0.5rem;
      }

      .collapse-btn {
        display: none;
      }

      .nav-item {
        justify-content: center;
        padding: 0.75rem;
      }
    }
  `],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    {
      label: 'Masters',
      icon: 'pi-database',
      permission: 'MASTER_VIEW',
      children: [
        { label: 'Units', icon: 'pi-hashtag', route: '/masters/units' },
        { label: 'Categories', icon: 'pi-folder', route: '/masters/categories' },
        { label: 'Warehouses', icon: 'pi-building', route: '/masters/warehouses' },
        { label: 'Suppliers', icon: 'pi-truck', route: '/masters/suppliers' },
        { label: 'Customers', icon: 'pi-users', route: '/masters/customers' },
      ],
    },
    {
      label: 'Inventory',
      icon: 'pi-box',
      permission: 'INVENTORY_VIEW',
      children: [
        { label: 'Raw Materials', icon: 'pi-circle', route: '/inventory/raw-materials' },
        { label: 'In-Process', icon: 'pi-cog', route: '/inventory/in-process' },
        { label: 'Finished Goods', icon: 'pi-check-circle', route: '/inventory/finished-goods' },
        { label: 'Stock Adjustment', icon: 'pi-pencil', route: '/inventory/stock-adjustment' },
      ],
    },
    {
      label: 'Production',
      icon: 'pi-sitemap',
      permission: 'PRODUCTION_VIEW',
      children: [
        { label: 'Bill of Materials', icon: 'pi-list', route: '/production/bom' },
        { label: 'Work Orders', icon: 'pi-file', route: '/production/work-orders' },
        { label: 'Tracking', icon: 'pi-chart-line', route: '/production/tracking' },
      ],
    },
    {
      label: 'Purchase',
      icon: 'pi-shopping-cart',
      permission: 'PURCHASE_VIEW',
      children: [
        { label: 'Purchase Orders', icon: 'pi-file', route: '/purchase/orders' },
        { label: 'Goods Receipt', icon: 'pi-inbox', route: '/purchase/grn' },
      ],
    },
    {
      label: 'Sales',
      icon: 'pi-dollar',
      permission: 'SALES_VIEW',
      children: [
        { label: 'Sales Orders', icon: 'pi-file', route: '/sales/orders' },
        { label: 'Order Tracking', icon: 'pi-map-marker', route: '/sales/tracking' },
      ],
    },
    {
      label: 'Delivery',
      icon: 'pi-send',
      permission: 'DELIVERY_VIEW',
      children: [
        { label: 'Challans', icon: 'pi-file', route: '/delivery/challans' },
        { label: 'Dispatch', icon: 'pi-truck', route: '/delivery/dispatch' },
      ],
    },
    {
      label: 'Invoicing',
      icon: 'pi-receipt',
      permission: 'INVOICE_VIEW',
      children: [
        { label: 'Invoices', icon: 'pi-file', route: '/invoicing/invoices' },
        { label: 'Payments', icon: 'pi-wallet', route: '/invoicing/payments' },
      ],
    },
    {
      label: 'Reports',
      icon: 'pi-chart-bar',
      permission: 'REPORT_VIEW',
      children: [
        { label: 'Inventory Reports', icon: 'pi-chart-line', route: '/reports/inventory' },
        { label: 'Sales Reports', icon: 'pi-chart-pie', route: '/reports/sales' },
        { label: 'Purchase Reports', icon: 'pi-chart-bar', route: '/reports/purchase' },
        { label: 'GST Reports', icon: 'pi-file-excel', route: '/reports/gst' },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi-cog',
      permission: 'SETTINGS_VIEW',
      children: [
        { label: 'Users', icon: 'pi-users', route: '/settings/users', permission: 'USER_VIEW' },
        { label: 'Roles', icon: 'pi-key', route: '/settings/roles', permission: 'USER_VIEW' },
        { label: 'System', icon: 'pi-sliders-h', route: '/settings/system' },
      ],
    },
  ];

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  isActive(item: MenuItem): boolean {
    if (item.route) {
      return this.router.isActive(item.route, false);
    }
    if (item.children) {
      return item.children.some(child => 
        child.route && this.router.isActive(child.route, false)
      );
    }
    return false;
  }

  toggleExpand(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
}

