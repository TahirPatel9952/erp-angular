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
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
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
