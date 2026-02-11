import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastrService } from 'ngx-toastr';
import { ProductionTrackingService } from '@core/services/production-tracking.service';
import { InProcessInventory } from '@core/models/production-tracking.model';
import { ApiResponse, PageResponse } from '@core/models/api-response.model';

@Component({
  selector: 'app-in-process',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, SkeletonModule],
  templateUrl: './in-process.component.html',
  styleUrl: './in-process.component.scss',
})
export class InProcessComponent implements OnInit {
  private productionTrackingService = inject(ProductionTrackingService);
  private toastr = inject(ToastrService);

  items = signal<InProcessInventory[]>([]);
  loading = signal(true);
  searchTerm = '';

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.productionTrackingService.getInProcessInventory({ page: 0, size: 100 }).subscribe({
      next: (response: ApiResponse<PageResponse<InProcessInventory>>) => {
        if (response.success && response.data) {
          this.items.set(response.data.content || []);
        } else {
          this.items.set([]);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading in-process inventory:', error);
        this.toastr.error('Failed to load in-process inventory', 'Error');
        this.items.set([]);
        this.loading.set(false);
      }
    });
  }

  getFilteredItems(): InProcessInventory[] {
    if (!this.searchTerm.trim()) {
      return this.items();
    }
    const term = this.searchTerm.toLowerCase();
    return this.items().filter(item => 
      item.workOrderNumber?.toLowerCase().includes(term) ||
      item.finishedGoodsName?.toLowerCase().includes(term) ||
      item.finishedGoodsCode?.toLowerCase().includes(term) ||
      item.currentStage?.toLowerCase().includes(term)
    );
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  }
}
