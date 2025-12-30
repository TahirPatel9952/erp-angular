import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastrService } from 'ngx-toastr';
import { WorkOrderService, BOMService, WarehouseService } from '../../../core/services';
import { WorkOrder, WorkOrderRequest } from '../../../core/models';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    TagModule, 
    DialogModule,
    DropdownModule,
    CalendarModule,
    ProgressBarModule
  ],
  templateUrl: './work-orders.component.html',
  styleUrl: './work-orders.component.scss',
})
export class WorkOrdersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private workOrderService = inject(WorkOrderService);
  private bomService = inject(BOMService);
  private warehouseService = inject(WarehouseService);

  workOrders = signal<WorkOrder[]>([]);
  boms = signal<any[]>([]);
  warehouses = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedWorkOrder: WorkOrder | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  workOrderForm: FormGroup = this.fb.group({
    bomId: [null, [Validators.required]],
    salesOrderId: [null],
    quantity: [1, [Validators.required, Validators.min(1)]],
    plannedStartDate: [new Date(), [Validators.required]],
    plannedEndDate: [null, [Validators.required]],
    sourceWarehouseId: [null],
    targetWarehouseId: [null],
    priority: ['MEDIUM'],
    notes: ['']
  });

  priorityOptions = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Urgent', value: 'URGENT' }
  ];

  ngOnInit(): void {
    this.loadWorkOrders();
    this.loadBoms();
    this.loadWarehouses();
  }

  loadWorkOrders(): void {
    this.loading.set(true);
    this.workOrderService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.workOrders.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load work orders');
      }
    });
  }

  loadBoms(): void {
    this.bomService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.boms.set(response.data.map(bom => ({ 
            label: `${bom.code} - ${bom.finishedGoodsName}`, 
            value: bom.id 
          })));
        }
      }
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.warehouses.set(response.data.map(wh => ({ label: wh.name, value: wh.id })));
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.workOrderService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.workOrders.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadWorkOrders();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadWorkOrders();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedWorkOrder = null;
    this.workOrderForm.reset({ 
      quantity: 1, 
      priority: 'MEDIUM',
      plannedStartDate: new Date()
    });
    this.dialogVisible = true;
  }

  editWorkOrder(wo: WorkOrder): void {
    this.isEditing = true;
    this.selectedWorkOrder = wo;
    this.workOrderForm.patchValue({
      bomId: wo.bomId,
      salesOrderId: wo.salesOrderId,
      quantity: wo.quantity,
      plannedStartDate: new Date(wo.plannedStartDate),
      plannedEndDate: new Date(wo.plannedEndDate),
      sourceWarehouseId: wo.sourceWarehouseId,
      targetWarehouseId: wo.targetWarehouseId,
      priority: wo.priority,
      notes: wo.notes
    });
    this.dialogVisible = true;
  }

  saveWorkOrder(): void {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.workOrderForm.value;
    const request: WorkOrderRequest = {
      ...formValue,
      plannedStartDate: this.formatDate(formValue.plannedStartDate),
      plannedEndDate: this.formatDate(formValue.plannedEndDate)
    };

    if (this.isEditing && this.selectedWorkOrder) {
      this.workOrderService.update(this.selectedWorkOrder.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Work order updated successfully');
            this.dialogVisible = false;
            this.loadWorkOrders();
          }
        },
        error: () => this.toastr.error('Failed to update work order')
      });
    } else {
      this.workOrderService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Work order created successfully');
            this.dialogVisible = false;
            this.loadWorkOrders();
          }
        },
        error: () => this.toastr.error('Failed to create work order')
      });
    }
  }

  startWorkOrder(wo: WorkOrder): void {
    this.workOrderService.start(wo.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work order started');
          this.loadWorkOrders();
        }
      },
      error: () => this.toastr.error('Failed to start work order')
    });
  }

  completeWorkOrder(wo: WorkOrder): void {
    this.workOrderService.complete(wo.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work order completed');
          this.loadWorkOrders();
        }
      },
      error: () => this.toastr.error('Failed to complete work order')
    });
  }

  cancelWorkOrder(wo: WorkOrder): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.workOrderService.cancel(wo.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Work order cancelled');
            this.loadWorkOrders();
          }
        },
        error: () => this.toastr.error('Failed to cancel work order')
      });
    }
  }

  deleteWorkOrder(wo: WorkOrder): void {
    if (confirm(`Are you sure you want to delete work order ${wo.orderNumber}?`)) {
      this.workOrderService.delete(wo.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Work order deleted');
            this.loadWorkOrders();
          }
        },
        error: () => this.toastr.error('Failed to delete work order')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
