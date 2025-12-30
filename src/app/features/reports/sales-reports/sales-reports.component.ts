import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './sales-reports.component.html',
  styleUrl: './sales-reports.component.scss',
})
export class SalesReportsComponent implements OnInit {
  salesSummary = signal({ totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 });
  collectionSummary = signal({ invoiced: 0, collected: 0, outstanding: 0 });
  topCustomers = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.salesSummary.set({ totalOrders: 156, totalRevenue: 8500000, avgOrderValue: 54487 });
    this.collectionSummary.set({ invoiced: 8500000, collected: 7200000, outstanding: 1300000 });
    this.topCustomers.set([
      { name: 'ABC Industries', orders: 45, revenue: 2500000, outstanding: 150000 },
      { name: 'XYZ Corp', orders: 38, revenue: 1800000, outstanding: 200000 },
      { name: 'Tech Solutions', orders: 32, revenue: 1500000, outstanding: 100000 },
      { name: 'Industrial Works', orders: 28, revenue: 1200000, outstanding: 50000 },
      { name: 'Metro Engineering', orders: 25, revenue: 1000000, outstanding: 0 },
    ]);
  }
}
