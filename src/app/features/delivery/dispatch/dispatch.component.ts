import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.scss',
})
export class DispatchComponent implements OnInit {
  dispatches = signal<any[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadDispatches();
  }

  loadDispatches(): void {
    this.dispatches.set([
      { id: 1, dispatchId: 'DIS-001', challanNo: 'DC-2024-001', vehicleNo: 'MH-12-AB-1234', driver: 'Rajesh Kumar', dispatchTime: '2024-01-15 10:30', status: 'Completed' },
      { id: 2, dispatchId: 'DIS-002', challanNo: 'DC-2024-002', vehicleNo: 'MH-12-CD-5678', driver: 'Suresh Patil', dispatchTime: '2024-01-16 14:00', status: 'In Progress' },
    ]);
  }
}
