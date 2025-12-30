import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../core/auth/services/auth.service';
import { DashboardService, RawMaterialService } from '../../core/services';
import { DashboardCard, RecentActivity, PendingOrder, LowStockItem } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ChartModule, TableModule, TagModule, ButtonModule, SkeletonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private rawMaterialService = inject(RawMaterialService);

  loading = signal(true);
  userName = this.authService.currentUser()?.fullName || 'User';

  statsCards = signal<DashboardCard[]>([
    { title: 'Total Sales', value: '₹0', icon: 'pi-indian-rupee', trend: 'Loading...', trendUp: true, color: '#4caf50' },
    { title: 'Pending Orders', value: '0', icon: 'pi-shopping-cart', trend: 'Loading...', trendUp: true, color: '#2196f3' },
    { title: 'Production', value: '0', icon: 'pi-cog', trend: 'Loading...', trendUp: true, color: '#ff9800' },
    { title: 'Low Stock Items', value: '0', icon: 'pi-exclamation-triangle', trend: 'Loading...', trendUp: false, color: '#f44336' },
  ]);

  salesChartData = signal<any>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [0, 0, 0, 0, 0, 0],
      fill: true,
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
    }],
  });

  productionChartData = signal<any>({
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#ff9800', '#9e9e9e'],
    }],
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  pendingOrders = signal<PendingOrder[]>([]);
  lowStockItems = signal<LowStockItem[]>([]);
  recentActivities = signal<RecentActivity[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    // Load stats
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const stats = response.data;
          this.statsCards.set([
            { 
              title: 'Total Sales', 
              value: `₹${this.formatNumber(stats.totalSales)}`, 
              icon: 'pi-indian-rupee', 
              trend: `${stats.salesGrowthPercent}% vs last month`, 
              trendUp: stats.salesGrowthPercent >= 0, 
              color: '#4caf50' 
            },
            { 
              title: 'Pending Orders', 
              value: stats.pendingOrders.toString(), 
              icon: 'pi-shopping-cart', 
              trend: `${stats.newOrdersToday} new today`, 
              trendUp: true, 
              color: '#2196f3' 
            },
            { 
              title: 'Production', 
              value: stats.productionCount.toString(), 
              icon: 'pi-cog', 
              trend: `${stats.productionEfficiencyPercent}% efficiency`, 
              trendUp: stats.productionEfficiencyPercent >= 80, 
              color: '#ff9800' 
            },
            { 
              title: 'Low Stock Items', 
              value: stats.lowStockItems.toString(), 
              icon: 'pi-exclamation-triangle', 
              trend: `${stats.criticalStockItems} critical`, 
              trendUp: false, 
              color: '#f44336' 
            },
          ]);
        }
      },
      error: () => {
        // Keep default values on error
      }
    });

    // Load sales chart
    this.dashboardService.getSalesChart('month').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesChartData.set(response.data);
        }
      }
    });

    // Load production chart
    this.dashboardService.getProductionChart().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productionChartData.set(response.data);
        }
      }
    });

    // Load pending orders
    this.dashboardService.getPendingOrders(5).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pendingOrders.set(response.data);
        }
      }
    });

    // Load low stock items
    this.rawMaterialService.getLowStockItems().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lowStockItems.set(response.data.slice(0, 5).map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            currentStock: item.currentStock || 0,
            reorderLevel: item.reorderLevel,
            unitName: item.unitSymbol || item.unitName || '',
            isCritical: (item.currentStock || 0) < item.reorderLevel / 2
          })));
        }
      }
    });

    // Load recent activities
    this.dashboardService.getRecentActivities(5).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentActivities.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatNumber(num: number): string {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + 'Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
      case 'completed': 
        return 'success';
      case 'processing':
      case 'in progress': 
        return 'info';
      case 'pending': 
        return 'warning';
      case 'cancelled':
      case 'failed': 
        return 'danger';
      default: 
        return 'secondary';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'sale': return 'pi pi-shopping-cart';
      case 'production': return 'pi pi-cog';
      case 'purchase': return 'pi pi-truck';
      case 'inventory': return 'pi pi-box';
      case 'delivery': return 'pi pi-send';
      case 'payment': return 'pi pi-wallet';
      default: return 'pi pi-info-circle';
    }
  }
}
