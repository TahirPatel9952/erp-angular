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
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dispatch Management</h1>
        <div class="header-actions">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input pInputText placeholder="Search dispatches..." [(ngModel)]="searchTerm" />
          </span>
        </div>
      </div>

      <div class="card">
        <p-table 
          [value]="dispatches()" 
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Dispatch ID</th>
              <th>Challan No</th>
              <th>Vehicle No</th>
              <th>Driver</th>
              <th>Dispatch Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-dispatch>
            <tr>
              <td><strong>{{ dispatch.dispatchId }}</strong></td>
              <td>{{ dispatch.challanNo }}</td>
              <td>{{ dispatch.vehicleNo }}</td>
              <td>{{ dispatch.driver }}</td>
              <td>{{ dispatch.dispatchTime }}</td>
              <td>
                <p-tag 
                  [value]="dispatch.status" 
                  [severity]="dispatch.status === 'Completed' ? 'success' : 'warning'"
                />
              </td>
              <td>
                <button pButton icon="pi pi-eye" class="p-button-text p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-4">
                <i class="pi pi-truck text-4xl text-gray-300"></i>
                <p class="text-gray-500 mt-2">No dispatches found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  `],
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

