import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-in-process',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule],
  templateUrl: './in-process.component.html',
  styleUrl: './in-process.component.scss',
})
export class InProcessComponent implements OnInit {
  items = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.items.set([
      { id: 1, workOrder: 'WO-2024-001', product: 'Motor Assembly', stage: 'Assembly', quantity: 50, startDate: '2024-01-15', status: 'In Progress' },
      { id: 2, workOrder: 'WO-2024-002', product: 'Gear Box', stage: 'Machining', quantity: 30, startDate: '2024-01-14', status: 'In Progress' },
      { id: 3, workOrder: 'WO-2024-003', product: 'Shaft', stage: 'Quality Check', quantity: 100, startDate: '2024-01-13', status: 'Pending QC' },
    ]);
  }
}
