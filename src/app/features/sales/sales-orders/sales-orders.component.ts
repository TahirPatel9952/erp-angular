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
import { SalesOrderService, CustomerService, FinishedGoodsService, WarehouseService } from '../../../core/services';
import { SalesOrder, SalesOrderRequest } from '../../../core/models';

@Component({
  selector: 'app-sales-orders',
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
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss',
})
export class SalesOrdersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private salesOrderService = inject(SalesOrderService);
  private customerService = inject(CustomerService);
  private finishedGoodsService = inject(FinishedGoodsService);
  private warehouseService = inject(WarehouseService);

  salesOrders = signal<SalesOrder[]>([]);
  customers = signal<any[]>([]);
  products = signal<any[]>([]);
  warehouses = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedOrder: SalesOrder | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  salesOrderForm: FormGroup = this.fb.group({
    customerId: [null, [Validators.required]],
    warehouseId: [null],
    orderDate: [new Date(), [Validators.required]],
    expectedDeliveryDate: [null],
    shippingAddress: [''],
    notes: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadSalesOrders();
    this.loadCustomers();
    this.loadProducts();
    this.loadWarehouses();
  }

  get items(): FormArray {
    return this.salesOrderForm.get('items') as FormArray;
  }

  loadSalesOrders(): void {
    this.loading.set(true);
    this.salesOrderService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesOrders.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load sales orders');
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.customers.set(response.data.map(c => ({ label: c.name, value: c.id })));
        }
      }
    });
  }

  loadProducts(): void {
    this.finishedGoodsService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products.set(response.data.map(fg => ({ 
            label: `${fg.code} - ${fg.name}`, 
            value: fg.id,
            unitPrice: fg.sellingPrice,
            unitName: fg.unitSymbol
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
      this.salesOrderService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.salesOrders.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadSalesOrders();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadSalesOrders();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedOrder = null;
    this.salesOrderForm.reset({ orderDate: new Date() });
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      finishedGoodsId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required]],
      discountPercent: [0],
      notes: ['']
    }));
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onProductSelect(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('finishedGoodsId')?.value;
    const product = this.products().find(p => p.value === productId);
    if (product) {
      item.get('unitPrice')?.setValue(product.unitPrice);
    }
  }

  calculateTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      const discount = item.get('discountPercent')?.value || 0;
      const subtotal = qty * price;
      return sum + (subtotal - (subtotal * discount / 100));
    }, 0);
  }

  saveSalesOrder(): void {
    if (this.salesOrderForm.invalid) {
      this.salesOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.salesOrderForm.value;
    const request: SalesOrderRequest = {
      ...formValue,
      orderDate: new Date(formValue.orderDate).toISOString().split('T')[0],
      expectedDeliveryDate: formValue.expectedDeliveryDate ? 
        new Date(formValue.expectedDeliveryDate).toISOString().split('T')[0] : null
    };

    if (this.isEditing && this.selectedOrder) {
      this.salesOrderService.update(this.selectedOrder.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Sales order updated successfully');
            this.dialogVisible = false;
            this.loadSalesOrders();
          }
        },
        error: () => this.toastr.error('Failed to update sales order')
      });
    } else {
      this.salesOrderService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Sales order created successfully');
            this.dialogVisible = false;
            this.loadSalesOrders();
          }
        },
        error: () => this.toastr.error('Failed to create sales order')
      });
    }
  }

  confirmSalesOrder(so: SalesOrder): void {
    this.salesOrderService.confirm(so.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Sales order confirmed');
          this.loadSalesOrders();
        }
      },
      error: () => this.toastr.error('Failed to confirm sales order')
    });
  }

  cancelSalesOrder(so: SalesOrder): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.salesOrderService.cancel(so.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Sales order cancelled');
            this.loadSalesOrders();
          }
        },
        error: () => this.toastr.error('Failed to cancel sales order')
      });
    }
  }

  deleteSalesOrder(so: SalesOrder): void {
    if (confirm(`Are you sure you want to delete SO ${so.orderNumber}?`)) {
      this.salesOrderService.delete(so.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Sales order deleted');
            this.loadSalesOrders();
          }
        },
        error: () => this.toastr.error('Failed to delete sales order')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED': return 'success';
      case 'CONFIRMED':
      case 'PROCESSING': return 'info';
      case 'PARTIAL_DELIVERED': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }
}

