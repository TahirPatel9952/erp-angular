import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-stock-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './stock-adjustment.component.html',
  styleUrl: './stock-adjustment.component.scss',
})
export class StockAdjustmentComponent implements OnInit {
  adjustments = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadAdjustments();
  }

  loadAdjustments(): void {
    this.adjustments.set([
      { id: 1, adjustmentNo: 'ADJ-001', date: '2024-01-15', item: 'Steel Rod 10mm', type: 'Addition', quantity: 50, reason: 'Stock Count Correction', status: 'Approved' },
      { id: 2, adjustmentNo: 'ADJ-002', date: '2024-01-16', item: 'Copper Wire', type: 'Deduction', quantity: 10, reason: 'Damaged Goods', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
