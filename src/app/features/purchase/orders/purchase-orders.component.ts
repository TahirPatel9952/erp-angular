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
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

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
    InputNumberModule,
    TooltipModule,
    SkeletonModule
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
  isLoading = false; // Guard to prevent multiple simultaneous calls

  purchaseOrderForm: FormGroup = this.fb.group({
    supplierId: [null, [Validators.required]],
    warehouseId: [null, [Validators.required]],
    orderDate: [new Date(), [Validators.required]],
    expectedDeliveryDate: [null, [Validators.required]],
    paymentTerms: [''],
    shippingMethod: [''],
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
    // Prevent multiple simultaneous calls
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.loading.set(true);
    this.purchaseOrderService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.purchaseOrders.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        } else {
          this.purchaseOrders.set([]);
          this.totalRecords = 0;
        }
        this.loading.set(false);
        this.isLoading = false;
      },
      error: (err) => {
        this.loading.set(false);
        this.isLoading = false;
        this.purchaseOrders.set([]);
        this.totalRecords = 0;
        this.toastr.error('Failed to load purchase orders', 'Error');
        console.error('Error loading purchase orders:', err);
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.suppliers.set(response.data.map(s => ({ label: s.name, value: s.id })));
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load suppliers', 'Error');
        console.error('Error loading suppliers:', err);
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
            unitId: rm.unitId,
            unitSymbol: rm.unitSymbol || rm.unitName
          })));
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load raw materials', 'Error');
        console.error('Error loading raw materials:', err);
      }
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.warehouses.set(response.data.map(w => ({ label: w.name, value: w.id })));
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load warehouses', 'Error');
        console.error('Error loading warehouses:', err);
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
        },
        error: (err) => {
          this.toastr.error('Failed to search purchase orders', 'Error');
          console.error('Error searching purchase orders:', err);
        }
      });
    } else {
      this.loadPurchaseOrders();
    }
  }

  onPageChange(event: any): void {
    // Only update if values actually changed
    if (this.first !== event.first || this.rows !== event.rows) {
      this.first = event.first;
      this.rows = event.rows;
      this.loadPurchaseOrders();
    }
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedOrder = null;
    this.purchaseOrderForm.reset({
      orderDate: new Date(),
      expectedDeliveryDate: null,
      paymentTerms: '',
      shippingMethod: '',
      notes: ''
    });
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      rawMaterialId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(0.001)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      taxPercent: [18],
      discountPercent: [0],
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
      const tax = item.get('taxPercent')?.value || 0;
      const discount = item.get('discountPercent')?.value || 0;
      const subtotal = qty * price;
      const discountAmount = subtotal * (discount / 100);
      const taxAmount = (subtotal - discountAmount) * (tax / 100);
      return sum + subtotal - discountAmount + taxAmount;
    }, 0);
  }

  savePurchaseOrder(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    const formValue = this.purchaseOrderForm.value;
    const request: PurchaseOrderRequest = {
      supplierId: formValue.supplierId,
      warehouseId: formValue.warehouseId,
      orderDate: this.formatDate(formValue.orderDate),
      expectedDate: this.formatDate(formValue.expectedDeliveryDate),
      paymentTerms: formValue.paymentTerms || undefined,
      deliveryTerms: formValue.shippingMethod || undefined,
      notes: formValue.notes || undefined,
      items: formValue.items.map((item: any) => ({
        rawMaterialId: item.rawMaterialId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxPercent: item.taxPercent || undefined,
        discountPercent: item.discountPercent || undefined,
        notes: item.notes || undefined
      }))
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
        error: (error) => {
          console.error('Error updating purchase order:', error);
          const errorMsg = error?.error?.message || 'Failed to update purchase order';
          this.toastr.error(errorMsg, 'Error');
        }
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
        error: (error) => {
          console.error('Error creating purchase order:', error);
          const errorMsg = error?.error?.message || 'Failed to create purchase order';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  editPurchaseOrder(po: PurchaseOrder): void {
    this.isEditing = true;
    this.selectedOrder = po;
    // Load full PO details if items not loaded
    this.purchaseOrderService.getById(po.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const fullPo = response.data;
          this.purchaseOrderForm.patchValue({
            supplierId: fullPo.supplierId,
            warehouseId: fullPo.warehouseId,
            orderDate: fullPo.orderDate ? new Date(fullPo.orderDate) : null,
            expectedDeliveryDate: (fullPo.expectedDate || fullPo.expectedDeliveryDate) ? 
              new Date(fullPo.expectedDate || fullPo.expectedDeliveryDate || '') : null,
            paymentTerms: fullPo.paymentTerms,
            shippingMethod: fullPo.deliveryTerms || fullPo.shippingMethod,
            notes: fullPo.notes
          });
          this.items.clear();
          fullPo.items?.forEach(item => {
            this.items.push(this.fb.group({
              rawMaterialId: item.rawMaterialId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxPercent: item.taxPercent || 18,
              discountPercent: 0,
              notes: item.notes || ''
            }));
          });
          this.dialogVisible = true;
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load purchase order details', 'Error');
        console.error('Error loading purchase order:', err);
      }
    });
  }

  approvePurchaseOrder(po: PurchaseOrder): void {
    this.purchaseOrderService.approve(po.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Purchase order approved');
          this.loadPurchaseOrders();
        }
      },
      error: (err) => {
        this.toastr.error(`Failed to approve: ${err.error?.error?.message || err.message}`);
      }
    });
  }

  sendPurchaseOrder(po: PurchaseOrder): void {
    this.purchaseOrderService.send(po.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Purchase order sent to supplier');
          this.loadPurchaseOrders();
        }
      },
      error: (err) => {
        this.toastr.error(`Failed to send: ${err.error?.error?.message || err.message}`);
      }
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
        error: (err) => {
          this.toastr.error(`Failed to cancel: ${err.error?.error?.message || err.message}`);
        }
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
        error: (err) => {
          this.toastr.error(`Failed to delete: ${err.error?.error?.message || err.message}`);
        }
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'RECEIVED':
      case 'COMPLETED':
      case 'CLOSED': return 'success';
      case 'APPROVED':
      case 'SENT': return 'info';
      case 'PARTIALLY_RECEIVED': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'DRAFT':
      case 'PENDING_APPROVAL': return 'secondary';
      default: return 'info';
    }
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
}
