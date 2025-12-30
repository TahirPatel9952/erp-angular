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
import { DeliveryChallanService, SalesOrderService, WarehouseService } from '../../../core/services';
import { DeliveryChallan, DeliveryChallanRequest } from '../../../core/models';

@Component({
  selector: 'app-delivery-challans',
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
  templateUrl: './delivery-challans.component.html',
  styleUrl: './delivery-challans.component.scss',
})
export class DeliveryChallansComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private deliveryChallanService = inject(DeliveryChallanService);
  private salesOrderService = inject(SalesOrderService);
  private warehouseService = inject(WarehouseService);

  challans = signal<DeliveryChallan[]>([]);
  salesOrders = signal<any[]>([]);
  warehouses = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedChallan: DeliveryChallan | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  challanForm: FormGroup = this.fb.group({
    salesOrderId: [null, [Validators.required]],
    warehouseId: [null, [Validators.required]],
    challanDate: [new Date(), [Validators.required]],
    transporterName: [''],
    vehicleNumber: [''],
    driverName: [''],
    driverPhone: [''],
    shippingAddress: ['', [Validators.required]],
    notes: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadChallans();
    this.loadSalesOrders();
    this.loadWarehouses();
  }

  get items(): FormArray {
    return this.challanForm.get('items') as FormArray;
  }

  loadChallans(): void {
    this.loading.set(true);
    this.deliveryChallanService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.challans.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load delivery challans');
      }
    });
  }

  loadSalesOrders(): void {
    this.salesOrderService.getByStatus('CONFIRMED').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesOrders.set(response.data.map(so => ({ 
            label: `${so.orderNumber} - ${so.customerName}`, 
            value: so.id,
            shippingAddress: so.shippingAddress
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
      this.deliveryChallanService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.challans.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadChallans();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadChallans();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedChallan = null;
    this.challanForm.reset({ challanDate: new Date() });
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  onSalesOrderSelect(): void {
    const salesOrderId = this.challanForm.get('salesOrderId')?.value;
    const salesOrder = this.salesOrders().find(so => so.value === salesOrderId);
    if (salesOrder && salesOrder.shippingAddress) {
      this.challanForm.get('shippingAddress')?.setValue(salesOrder.shippingAddress);
    }
  }

  addItem(): void {
    this.items.push(this.fb.group({
      finishedGoodsId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    }));
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  saveChallan(): void {
    if (this.challanForm.invalid) {
      this.challanForm.markAllAsTouched();
      return;
    }

    const formValue = this.challanForm.value;
    const request: DeliveryChallanRequest = {
      ...formValue,
      challanDate: new Date(formValue.challanDate).toISOString().split('T')[0]
    };

    if (this.isEditing && this.selectedChallan) {
      this.deliveryChallanService.update(this.selectedChallan.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Delivery challan updated successfully');
            this.dialogVisible = false;
            this.loadChallans();
          }
        },
        error: () => this.toastr.error('Failed to update delivery challan')
      });
    } else {
      this.deliveryChallanService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Delivery challan created successfully');
            this.dialogVisible = false;
            this.loadChallans();
          }
        },
        error: () => this.toastr.error('Failed to create delivery challan')
      });
    }
  }

  dispatchChallan(challan: DeliveryChallan): void {
    this.deliveryChallanService.dispatch(challan.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Delivery dispatched');
          this.loadChallans();
        }
      },
      error: () => this.toastr.error('Failed to dispatch')
    });
  }

  deliverChallan(challan: DeliveryChallan): void {
    const receivedBy = prompt('Enter receiver name:');
    if (receivedBy) {
      this.deliveryChallanService.deliver(challan.id, receivedBy).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Delivery completed');
            this.loadChallans();
          }
        },
        error: () => this.toastr.error('Failed to complete delivery')
      });
    }
  }

  cancelChallan(challan: DeliveryChallan): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.deliveryChallanService.cancel(challan.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Delivery cancelled');
            this.loadChallans();
          }
        },
        error: () => this.toastr.error('Failed to cancel')
      });
    }
  }

  printChallan(challan: DeliveryChallan): void {
    this.deliveryChallanService.downloadPdf(challan.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DC_${challan.challanNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to download challan')
    });
  }

  deleteChallan(challan: DeliveryChallan): void {
    if (confirm(`Are you sure you want to delete challan ${challan.challanNumber}?`)) {
      this.deliveryChallanService.delete(challan.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Delivery challan deleted');
            this.loadChallans();
          }
        },
        error: () => this.toastr.error('Failed to delete')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'DISPATCHED':
      case 'IN_TRANSIT': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }
}

