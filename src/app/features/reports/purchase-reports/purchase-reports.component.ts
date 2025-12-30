import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-purchase-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './purchase-reports.component.html',
  styleUrl: './purchase-reports.component.scss',
})
export class PurchaseReportsComponent implements OnInit {
  purchaseSummary = signal({ totalPOs: 0, totalValue: 0, pending: 0 });
  paymentSummary = signal({ payable: 0, paid: 0, outstanding: 0 });
  topSuppliers = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.purchaseSummary.set({ totalPOs: 89, totalValue: 3200000, pending: 12 });
    this.paymentSummary.set({ payable: 3200000, paid: 2800000, outstanding: 400000 });
    this.topSuppliers.set([
      { name: 'Steel India Ltd', orders: 25, value: 1200000, outstanding: 150000 },
      { name: 'Plastic World', orders: 20, value: 800000, outstanding: 100000 },
      { name: 'Electric Components', orders: 18, value: 600000, outstanding: 50000 },
      { name: 'Metal Works', orders: 15, value: 400000, outstanding: 50000 },
      { name: 'Industrial Supplies', orders: 11, value: 200000, outstanding: 50000 },
    ]);
  }
}
