import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss',
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.purchaseOrders.set([
      { id: 1, poNumber: 'PO-2024-001', date: '2024-01-10', supplier: 'Steel India Ltd', itemCount: 5, total: 125000, deliveryDate: '2024-01-20', status: 'Received' },
      { id: 2, poNumber: 'PO-2024-002', date: '2024-01-12', supplier: 'Plastic World', itemCount: 3, total: 45000, deliveryDate: '2024-01-22', status: 'Partial' },
      { id: 3, poNumber: 'PO-2024-003', date: '2024-01-15', supplier: 'Electric Components', itemCount: 8, total: 78000, deliveryDate: '2024-01-25', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
