import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService, SupplierService, RawMaterialService, WarehouseService } from '../../../core/services';
import { PurchaseOrder, PurchaseOrderRequest } from '../../../core/models';

@Component({
  selector: 'app-purchase-orders',
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
    InputNumberModule
  ],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss',
})
export class PurchaseOrdersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private purchaseOrderService = inject(PurchaseOrderService);
  private supplierService = inject(SupplierService);
  private rawMaterialService = inject(RawMaterialService);
  private warehouseService = inject(WarehouseService);

  purchaseOrders = signal<PurchaseOrder[]>([]);
  suppliers = signal<any[]>([]);
  rawMaterials = signal<any[]>([]);
  warehouses = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedOrder: PurchaseOrder | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  purchaseOrderForm: FormGroup = this.fb.group({
    supplierId: [null, [Validators.required]],
    warehouseId: [null, [Validators.required]],
    expectedDeliveryDate: [null],
    notes: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadRawMaterials();
    this.loadWarehouses();
  }

  get items(): FormArray {
    return this.purchaseOrderForm.get('items') as FormArray;
  }

  loadPurchaseOrders(): void {
    this.loading.set(true);
    this.purchaseOrderService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.purchaseOrders.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load purchase orders');
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.suppliers.set(response.data.map(s => ({ label: s.name, value: s.id })));
        }
      }
    });
  }

  loadRawMaterials(): void {
    this.rawMaterialService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.rawMaterials.set(response.data.map(rm => ({ 
            label: `${rm.code} - ${rm.name}`, 
            value: rm.id,
            unitPrice: rm.unitPrice,
            unitName: rm.unitSymbol
          })));
        }
      }
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.warehouses.set(response.data.map(w => ({ label: w.name, value: w.id })));
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.purchaseOrderService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.purchaseOrders.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadPurchaseOrders();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadPurchaseOrders();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedOrder = null;
    this.purchaseOrderForm.reset();
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      rawMaterialId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required]],
      notes: ['']
    }));
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onMaterialSelect(index: number): void {
    const item = this.items.at(index);
    const materialId = item.get('rawMaterialId')?.value;
    const material = this.rawMaterials().find(m => m.value === materialId);
    if (material) {
      item.get('unitPrice')?.setValue(material.unitPrice);
    }
  }

  calculateTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      return sum + (qty * price);
    }, 0);
  }

  savePurchaseOrder(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.purchaseOrderForm.value;
    const request: PurchaseOrderRequest = {
      ...formValue,
      expectedDeliveryDate: formValue.expectedDeliveryDate ? 
        new Date(formValue.expectedDeliveryDate).toISOString().split('T')[0] : null
    };

    if (this.isEditing && this.selectedOrder) {
      this.purchaseOrderService.update(this.selectedOrder.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Purchase order updated successfully');
            this.dialogVisible = false;
            this.loadPurchaseOrders();
          }
        },
        error: () => this.toastr.error('Failed to update purchase order')
      });
    } else {
      this.purchaseOrderService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Purchase order created successfully');
            this.dialogVisible = false;
            this.loadPurchaseOrders();
          }
        },
        error: () => this.toastr.error('Failed to create purchase order')
      });
    }
  }

  approvePurchaseOrder(po: PurchaseOrder): void {
    this.purchaseOrderService.approve(po.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Purchase order approved');
          this.loadPurchaseOrders();
        }
      },
      error: () => this.toastr.error('Failed to approve purchase order')
    });
  }

  sendPurchaseOrder(po: PurchaseOrder): void {
    this.purchaseOrderService.sendToSupplier(po.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Purchase order sent to supplier');
          this.loadPurchaseOrders();
        }
      },
      error: () => this.toastr.error('Failed to send purchase order')
    });
  }

  cancelPurchaseOrder(po: PurchaseOrder): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.purchaseOrderService.cancel(po.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Purchase order cancelled');
            this.loadPurchaseOrders();
          }
        },
        error: () => this.toastr.error('Failed to cancel purchase order')
      });
    }
  }

  deletePurchaseOrder(po: PurchaseOrder): void {
    if (confirm(`Are you sure you want to delete PO ${po.orderNumber}?`)) {
      this.purchaseOrderService.delete(po.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Purchase order deleted');
            this.loadPurchaseOrders();
          }
        },
        error: () => this.toastr.error('Failed to delete purchase order')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'RECEIVED':
      case 'COMPLETED': return 'success';
      case 'APPROVED':
      case 'SENT': return 'info';
      case 'PARTIAL_RECEIVED': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }
}

