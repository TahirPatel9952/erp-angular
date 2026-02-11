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
    finishedGoodsId: [null, [Validators.required]], // Will be set when BOM is selected
    salesOrderId: [null],
    quantity: [1, [Validators.required, Validators.min(1)]],
    plannedStartDate: [new Date(), [Validators.required]],
    plannedEndDate: [null, [Validators.required]],
    warehouseId: [null, [Validators.required]], // Changed from sourceWarehouseId/targetWarehouseId
    priority: ['MEDIUM'],
    batchNo: [null],
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
          const orders = response.data.content || [];
          // Map backend field names to frontend if needed
          const mappedOrders = orders.map((wo: any) => ({
            ...wo,
            orderNumber: wo.orderNumber || wo.workOrderNo,
            quantity: wo.quantity || wo.plannedQuantity,
            plannedStartDate: wo.plannedStartDate || wo.scheduledStartDate,
            plannedEndDate: wo.plannedEndDate || wo.scheduledEndDate,
            status: wo.status || 'DRAFT' // Default to DRAFT if status is missing
          }));
          this.workOrders.set(mappedOrders);
          this.totalRecords = response.data.totalElements;
        } else {
          this.workOrders.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading work orders:', error);
        this.loading.set(false);
        this.toastr.error('Failed to load work orders', 'Error');
      }
    });
  }

  loadBoms(): void {
    this.bomService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // response.data is already an array (not wrapped in content)
          const bomArray = Array.isArray(response.data) ? response.data : [];
          this.boms.set(bomArray.map(bom => ({ 
            label: `${bom.code} - ${bom.finishedGoodsName}`, 
            value: bom.id,
            finishedGoodsId: bom.finishedGoodsId // Store finishedGoodsId for later use
          })));
        }
      },
      error: (error) => {
        console.error('Error loading BOMs:', error);
        this.toastr.error('Failed to load BOMs', 'Error');
      }
    });
  }

  onBomChange(): void {
    const bomId = this.workOrderForm.get('bomId')?.value;
    if (bomId) {
      const selectedBom = this.boms().find(b => b.value === bomId);
      if (selectedBom && selectedBom.finishedGoodsId) {
        this.workOrderForm.patchValue({ finishedGoodsId: selectedBom.finishedGoodsId });
      }
    }
  }

  loadWarehouses(): void {
    this.warehouseService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // response.data is already an array
          const warehouseArray = Array.isArray(response.data) ? response.data : [];
          this.warehouses.set(warehouseArray.map(wh => ({ label: wh.name, value: wh.id })));
        }
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.toastr.error('Failed to load warehouses', 'Error');
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
      bomId: null,
      finishedGoodsId: null,
      salesOrderId: null,
      quantity: 1, 
      priority: 'MEDIUM',
      plannedStartDate: new Date(),
      plannedEndDate: null,
      warehouseId: null,
      batchNo: null,
      notes: ''
    });
    this.dialogVisible = true;
  }

  editWorkOrder(wo: WorkOrder): void {
    this.isEditing = true;
    this.selectedWorkOrder = wo;
    
    // Get dates with fallback handling - handle both frontend and backend field names
    const startDate = wo.plannedStartDate || wo.scheduledStartDate;
    const endDate = wo.plannedEndDate || wo.scheduledEndDate;
    
    this.workOrderForm.patchValue({
      bomId: wo.bomId,
      finishedGoodsId: wo.finishedGoodsId,
      salesOrderId: wo.salesOrderId,
      quantity: wo.quantity || wo.plannedQuantity || 1,
      plannedStartDate: startDate ? new Date(startDate) : new Date(),
      plannedEndDate: endDate ? new Date(endDate) : new Date(),
      warehouseId: wo.warehouseId || wo.targetWarehouseId || wo.sourceWarehouseId,
      priority: wo.priority || 'MEDIUM',
      batchNo: wo.batchNo || '',
      notes: wo.notes || ''
    });
    this.dialogVisible = true;
  }

  saveWorkOrder(): void {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    const formValue = this.workOrderForm.value;
    
    // Map frontend fields to backend expected fields
    // Backend expects: bomId, finishedGoodsId, warehouseId, plannedQuantity, scheduledStartDate, scheduledEndDate
    const request: any = {
      bomId: formValue.bomId,
      finishedGoodsId: formValue.finishedGoodsId,
      warehouseId: formValue.warehouseId,
      plannedQuantity: formValue.quantity, // Backend expects plannedQuantity, not quantity
      scheduledStartDate: this.formatDate(formValue.plannedStartDate), // Backend expects scheduledStartDate
      scheduledEndDate: this.formatDate(formValue.plannedEndDate), // Backend expects scheduledEndDate
      priority: formValue.priority || 'MEDIUM',
      batchNo: formValue.batchNo || undefined,
      notes: formValue.notes || undefined
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
        error: (error) => {
          console.error('Error updating work order:', error);
          const errorMsg = error?.error?.message || 'Failed to update work order';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    } else {
      this.workOrderService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Work order created successfully');
            this.dialogVisible = false;
            this.workOrderForm.reset({
              quantity: 1,
              priority: 'MEDIUM',
              plannedStartDate: new Date()
            });
            this.loadWorkOrders();
          }
        },
        error: (error) => {
          console.error('Error creating work order:', error);
          const errorMsg = error?.error?.message || error?.error?.error?.message || 'Failed to create work order';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  releaseWorkOrder(wo: WorkOrder): void {
    if (!confirm(`Are you sure you want to release work order ${wo.orderNumber || wo.workOrderNo}?`)) {
      return;
    }
    
    this.workOrderService.release(wo.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work order released successfully');
          this.loadWorkOrders();
        }
      },
      error: (error) => {
        console.error('Error releasing work order:', error);
        const errorMsg = error?.error?.message || 'Failed to release work order';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }

  startWorkOrder(wo: WorkOrder): void {
    if (!confirm(`Start production for work order ${wo.orderNumber || wo.workOrderNo}?`)) {
      return;
    }
    
    this.workOrderService.start(wo.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work order started successfully');
          this.loadWorkOrders();
        }
      },
      error: (error) => {
        console.error('Error starting work order:', error);
        const errorMsg = error?.error?.message || 'Failed to start work order';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }

  completeWorkOrder(wo: WorkOrder): void {
    // Prompt for completed and rejected quantities
    const completedQty = prompt(`Enter completed quantity (planned: ${wo.quantity}):`, wo.completedQuantity?.toString() || wo.quantity?.toString());
    if (completedQty === null) return; // User cancelled
    
    const rejectedQty = prompt('Enter rejected quantity (optional, press Cancel for 0):', wo.rejectedQuantity?.toString() || '0');
    
    const completed = parseFloat(completedQty) || 0;
    const rejected = rejectedQty !== null ? (parseFloat(rejectedQty) || 0) : 0;
    
    this.workOrderService.complete(wo.id, completed, rejected).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work order completed successfully');
          this.loadWorkOrders();
        }
      },
      error: (error) => {
        console.error('Error completing work order:', error);
        const errorMsg = error?.error?.message || 'Failed to complete work order';
        this.toastr.error(errorMsg, 'Error');
      }
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

  viewWorkOrder(wo: WorkOrder): void {
    // TODO: Implement view details dialog or navigation
    console.log('View work order:', wo);
    this.toastr.info('View details feature coming soon', 'Info');
  }

  isDraftOrPlanned(status: string | undefined): boolean {
    if (!status) return false;
    const s = status.toUpperCase();
    return s === 'DRAFT' || s === 'PLANNED';
  }

  isReleased(status: string | undefined): boolean {
    if (!status) return false;
    return status.toUpperCase() === 'RELEASED';
  }

  isInProgress(status: string | undefined): boolean {
    if (!status) return false;
    return status.toUpperCase() === 'IN_PROGRESS';
  }

  isDraft(status: string | undefined): boolean {
    if (!status) return false;
    return status.toUpperCase() === 'DRAFT';
  }

  getStatusSeverity(status: string | undefined): 'success' | 'warning' | 'danger' | 'info' | 'secondary' {
    if (!status) return 'secondary';
    
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'RELEASED': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'DRAFT': return 'secondary';
      case 'PLANNED': return 'secondary';
      default: return 'info';
    }
  }

  // formatDate(date: Date): string {
  //   console.log("Date-------",date, typeof date);
  //   return date.toISOString().split('T')[0];
  // }
  formatDate(date: string | Date): string {
    if (!date) return '';
  
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
}
