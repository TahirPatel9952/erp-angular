import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, TimelineModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss',
})
export class TrackingComponent implements OnInit {
  trackingData = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadTrackingData();
  }

  loadTrackingData(): void {
    this.trackingData.set([
      { id: 1, workOrder: 'WO-2024-001', product: 'Motor Assembly A', currentStage: 'Assembly', operator: 'Ramesh K', startedAt: '2024-01-15 08:00', completedQty: 75, totalQty: 100, status: 'Running' },
      { id: 2, workOrder: 'WO-2024-002', product: 'Gear Box Standard', currentStage: 'Quality Check', operator: 'Sunil S', startedAt: '2024-01-14 09:30', completedQty: 50, totalQty: 50, status: 'Running' },
      { id: 3, workOrder: 'WO-2024-003', product: 'Shaft Assembly', currentStage: 'Machining', operator: 'Amit P', startedAt: '2024-01-20 07:00', completedQty: 0, totalQty: 200, status: 'Paused' },
    ]);
  }
}
