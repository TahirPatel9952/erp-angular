import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inventory-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './inventory-reports.component.html',
  styleUrl: './inventory-reports.component.scss',
})
export class InventoryReportsComponent implements OnInit {
  stockSummary = signal({ totalItems: 0, totalValue: 0, lowStock: 0 });
  movementSummary = signal({ received: 0, issued: 0, adjustments: 0 });
  agingData = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.stockSummary.set({ totalItems: 1250, totalValue: 4500000, lowStock: 23 });
    this.movementSummary.set({ received: 450, issued: 380, adjustments: 15 });
    this.agingData.set([
      { name: 'Steel Rod 10mm', category: 'Metals', quantity: 500, days0_30: 300, days31_60: 150, days61_90: 50, days90Plus: 0 },
      { name: 'Copper Wire', category: 'Metals', quantity: 200, days0_30: 100, days31_60: 50, days61_90: 30, days90Plus: 20 },
      { name: 'Plastic Granules', category: 'Plastics', quantity: 350, days0_30: 200, days31_60: 100, days61_90: 50, days90Plus: 0 },
    ]);
  }
}
