import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../core/services';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    TabViewModule,
    ChartModule,
    TableModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private reportService = inject(ReportService);

  loading = signal(false);
  activeTabIndex = 0;

  filterForm: FormGroup = this.fb.group({
    startDate: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
    endDate: [new Date()],
    reportType: ['sales']
  });

  reportTypes = [
    { label: 'Sales Report', value: 'sales' },
    { label: 'Purchase Report', value: 'purchase' },
    { label: 'Production Report', value: 'production' },
    { label: 'Inventory Report', value: 'inventory' },
    { label: 'Financial Summary', value: 'financial' }
  ];

  // Report data
  salesReport = signal<any>(null);
  purchaseReport = signal<any>(null);
  productionReport = signal<any>(null);
  inventoryReport = signal<any>(null);

  // Chart data
  salesChartData = signal<any>(null);
  productionChartData = signal<any>(null);

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit(): void {
    this.loadDefaultReports();
  }

  loadDefaultReports(): void {
    this.loadSalesReport();
    this.loadProductionReport();
  }

  loadSalesReport(): void {
    this.loading.set(true);
    const { startDate, endDate } = this.filterForm.value;
    
    this.reportService.getSalesReport(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesReport.set(response.data);
          this.salesChartData.set({
            labels: response.data.chartLabels || [],
            datasets: [{
              label: 'Sales',
              data: response.data.chartData || [],
              backgroundColor: '#4caf50'
            }]
          });
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load sales report');
      }
    });
  }

  loadPurchaseReport(): void {
    this.loading.set(true);
    const { startDate, endDate } = this.filterForm.value;
    
    this.reportService.getPurchaseReport(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.purchaseReport.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load purchase report');
      }
    });
  }

  loadProductionReport(): void {
    this.loading.set(true);
    const { startDate, endDate } = this.filterForm.value;
    
    this.reportService.getProductionReport(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productionReport.set(response.data);
          this.productionChartData.set({
            labels: ['Completed', 'In Progress', 'Pending'],
            datasets: [{
              data: [
                response.data.completedCount || 0,
                response.data.inProgressCount || 0,
                response.data.pendingCount || 0
              ],
              backgroundColor: ['#4caf50', '#ff9800', '#9e9e9e']
            }]
          });
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load production report');
      }
    });
  }

  loadInventoryReport(): void {
    this.loading.set(true);
    
    this.reportService.getInventoryReport().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.inventoryReport.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load inventory report');
      }
    });
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    switch (event.index) {
      case 0: this.loadSalesReport(); break;
      case 1: this.loadPurchaseReport(); break;
      case 2: this.loadProductionReport(); break;
      case 3: this.loadInventoryReport(); break;
    }
  }

  generateReport(): void {
    const { reportType } = this.filterForm.value;
    switch (reportType) {
      case 'sales': this.loadSalesReport(); break;
      case 'purchase': this.loadPurchaseReport(); break;
      case 'production': this.loadProductionReport(); break;
      case 'inventory': this.loadInventoryReport(); break;
    }
  }

  exportToPdf(): void {
    const { startDate, endDate, reportType } = this.filterForm.value;
    
    this.reportService.exportReport(
      reportType,
      'pdf',
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to export PDF')
    });
  }

  exportToExcel(): void {
    const { startDate, endDate, reportType } = this.filterForm.value;
    
    this.reportService.exportReport(
      reportType,
      'excel',
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to export Excel')
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  }
}

