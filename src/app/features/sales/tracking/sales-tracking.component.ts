import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-sales-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, ProgressBarModule],
  templateUrl: './sales-tracking.component.html',
  styleUrl: './sales-tracking.component.scss',
})
export class SalesTrackingComponent implements OnInit {
  trackingData = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadTrackingData();
  }

  loadTrackingData(): void {
    this.trackingData.set([
      { id: 1, orderNo: 'SO-2024-001', customer: 'ABC Industries', orderDate: '2024-01-15', deliveryDate: '2024-01-25', productionProgress: 100, deliveryProgress: 100, status: 'Completed' },
      { id: 2, orderNo: 'SO-2024-002', customer: 'XYZ Corp', orderDate: '2024-01-16', deliveryDate: '2024-01-26', productionProgress: 75, deliveryProgress: 0, status: 'In Progress' },
      { id: 3, orderNo: 'SO-2024-003', customer: 'Tech Solutions', orderDate: '2024-01-10', deliveryDate: '2024-01-20', productionProgress: 60, deliveryProgress: 0, status: 'Delayed' },
    ]);
  }
}
