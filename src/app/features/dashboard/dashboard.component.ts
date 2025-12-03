import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/services/auth.service';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendUp: boolean;
  color: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ChartModule, TableModule, TagModule, ButtonModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Welcome back, {{ userName }}!</p>
        </div>
        <div class="header-actions">
          <button pButton label="Generate Report" icon="pi pi-file-pdf" class="p-button-outlined"></button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        @for (card of statsCards; track card.title) {
          <div class="stat-card" [style.--accent-color]="card.color">
            <div class="stat-icon">
              <i [class]="'pi ' + card.icon"></i>
            </div>
            <div class="stat-content">
              <span class="stat-title">{{ card.title }}</span>
              <span class="stat-value">{{ card.value }}</span>
              <span class="stat-trend" [class.up]="card.trendUp" [class.down]="!card.trendUp">
                <i [class]="card.trendUp ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                {{ card.trend }}
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-card">
          <h3>Sales Overview</h3>
          <p-chart type="line" [data]="salesChartData" [options]="chartOptions" />
        </div>
        <div class="chart-card">
          <h3>Production Status</h3>
          <p-chart type="doughnut" [data]="productionChartData" [options]="doughnutOptions" />
        </div>
      </div>

      <!-- Tables Row -->
      <div class="tables-row">
        <!-- Pending Orders -->
        <div class="table-card">
          <div class="table-header">
            <h3>Pending Orders</h3>
            <a routerLink="/sales/orders" class="view-all">View All</a>
          </div>
          <p-table [value]="pendingOrders" [rows]="5" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-order>
              <tr>
                <td>{{ order.orderNo }}</td>
                <td>{{ order.customer }}</td>
                <td>{{ order.amount }}</td>
                <td>
                  <p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)" />
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Low Stock Alerts -->
        <div class="table-card">
          <div class="table-header">
            <h3>Low Stock Alerts</h3>
            <a routerLink="/inventory/raw-materials" class="view-all">View All</a>
          </div>
          <p-table [value]="lowStockItems" [rows]="5" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Item</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Action</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>{{ item.name }}</td>
                <td class="text-error">{{ item.currentStock }}</td>
                <td>{{ item.reorderLevel }}</td>
                <td>
                  <button pButton icon="pi pi-shopping-cart" class="p-button-text p-button-sm" pTooltip="Create PO"></button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-card">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          @for (activity of recentActivities; track activity.id) {
            <div class="activity-item">
              <div class="activity-icon" [class]="activity.type">
                <i [class]="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p>{{ activity.description }}</p>
                <span class="activity-meta">{{ activity.user }} • {{ activity.time }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: fadeIn 0.3s ease-in-out;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;

      h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0;
      }

      .subtitle {
        color: var(--text-secondary);
        margin: 0.25rem 0 0;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: var(--accent-color, var(--primary-color));
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 1.5rem;
        color: white;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-title {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-trend {
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &.up {
        color: var(--success-color);
      }

      &.down {
        color: var(--error-color);
      }
    }

    .charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        font-weight: 600;
      }
    }

    .tables-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .view-all {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 0.875rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .activity-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        font-weight: 600;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.sale {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.production {
        background: #e3f2fd;
        color: #1565c0;
      }

      &.purchase {
        background: #fff3e0;
        color: #ef6c00;
      }

      &.inventory {
        background: #f3e5f5;
        color: #7b1fa2;
      }
    }

    .activity-content {
      p {
        margin: 0;
        font-size: 0.875rem;
      }

      .activity-meta {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }

    @media (max-width: 1024px) {
      .charts-row,
      .tables-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  userName = this.authService.currentUser()?.fullName || 'User';

  statsCards: DashboardCard[] = [
    { title: 'Total Sales', value: '₹12.5L', icon: 'pi-indian-rupee', trend: '12% vs last month', trendUp: true, color: '#4caf50' },
    { title: 'Pending Orders', value: '28', icon: 'pi-shopping-cart', trend: '5 new today', trendUp: true, color: '#2196f3' },
    { title: 'Production', value: '156', icon: 'pi-cog', trend: '8% efficiency', trendUp: true, color: '#ff9800' },
    { title: 'Low Stock Items', value: '12', icon: 'pi-exclamation-triangle', trend: '3 critical', trendUp: false, color: '#f44336' },
  ];

  salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 95],
        fill: true,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      },
    ],
  };

  productionChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ['#4caf50', '#ff9800', '#9e9e9e'],
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  pendingOrders = [
    { orderNo: 'SO-2024-001', customer: 'ABC Industries', amount: '₹45,000', status: 'Processing' },
    { orderNo: 'SO-2024-002', customer: 'XYZ Corp', amount: '₹28,500', status: 'Confirmed' },
    { orderNo: 'SO-2024-003', customer: 'Tech Solutions', amount: '₹92,000', status: 'Pending' },
    { orderNo: 'SO-2024-004', customer: 'Global Trade', amount: '₹15,750', status: 'Processing' },
    { orderNo: 'SO-2024-005', customer: 'Prime Mfg', amount: '₹67,200', status: 'Confirmed' },
  ];

  lowStockItems = [
    { name: 'Steel Rods (10mm)', currentStock: 50, reorderLevel: 100 },
    { name: 'Copper Wire', currentStock: 25, reorderLevel: 50 },
    { name: 'Plastic Granules', currentStock: 100, reorderLevel: 200 },
    { name: 'Bearing (SKF)', currentStock: 15, reorderLevel: 30 },
    { name: 'Motor Oil', currentStock: 10, reorderLevel: 25 },
  ];

  recentActivities: RecentActivity[] = [
    { id: 1, type: 'sale', description: 'Sales Order SO-2024-006 created for ₹1,25,000', user: 'John Doe', time: '5 min ago' },
    { id: 2, type: 'production', description: 'Work Order WO-2024-015 completed - 500 units', user: 'Jane Smith', time: '15 min ago' },
    { id: 3, type: 'purchase', description: 'Purchase Order PO-2024-022 approved', user: 'Admin', time: '1 hour ago' },
    { id: 4, type: 'inventory', description: 'Stock adjustment for Raw Material RM-0045', user: 'Mike Wilson', time: '2 hours ago' },
    { id: 5, type: 'sale', description: 'Invoice INV-2024-089 generated', user: 'John Doe', time: '3 hours ago' },
  ];

  ngOnInit(): void {
    // Load dashboard data
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Processing': return 'info';
      case 'Pending': return 'warning';
      default: return 'secondary';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'sale': return 'pi pi-shopping-cart';
      case 'production': return 'pi pi-cog';
      case 'purchase': return 'pi pi-truck';
      case 'inventory': return 'pi pi-box';
      default: return 'pi pi-info-circle';
    }
  }
}

