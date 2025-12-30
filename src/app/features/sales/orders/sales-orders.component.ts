import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss',
})
export class SalesOrdersComponent implements OnInit {
  salesOrders = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.salesOrders.set([
      { id: 1, orderNo: 'SO-2024-001', date: '2024-01-15', customer: 'ABC Industries', itemCount: 5, total: 125000, deliveryDate: '2024-01-25', status: 'Delivered' },
      { id: 2, orderNo: 'SO-2024-002', date: '2024-01-16', customer: 'XYZ Corp', itemCount: 3, total: 85000, deliveryDate: '2024-01-26', status: 'In Production' },
      { id: 3, orderNo: 'SO-2024-003', date: '2024-01-17', customer: 'Tech Solutions', itemCount: 8, total: 210000, deliveryDate: '2024-01-30', status: 'Confirmed' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
