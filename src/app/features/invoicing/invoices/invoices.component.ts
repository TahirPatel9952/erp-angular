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
import { InvoiceService, SalesOrderService, CustomerService } from '../../../core/services';
import { Invoice, InvoiceRequest } from '../../../core/models';

@Component({
  selector: 'app-invoices',
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
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private invoiceService = inject(InvoiceService);
  private salesOrderService = inject(SalesOrderService);
  private customerService = inject(CustomerService);

  invoices = signal<Invoice[]>([]);
  salesOrders = signal<any[]>([]);
  customers = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedInvoice: Invoice | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  invoiceForm: FormGroup = this.fb.group({
    customerId: [null, [Validators.required]],
    salesOrderId: [null],
    invoiceDate: [new Date(), [Validators.required]],
    dueDate: [null, [Validators.required]],
    notes: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCustomers();
    this.loadSalesOrders();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.invoices.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load invoices');
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

  loadSalesOrders(): void {
    // Load confirmed sales orders that don't have invoices
    this.salesOrderService.getByStatus('CONFIRMED').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.salesOrders.set(response.data.content.map((so: any) => ({ 
            label: `${so.orderNumber} - ${so.customerName}`, 
            value: so.id,
            customerId: so.customerId,
            totalAmount: so.totalAmount
          })));
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.invoiceService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.invoices.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadInvoices();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadInvoices();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedInvoice = null;
    this.invoiceForm.reset({ invoiceDate: new Date() });
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  createFromSalesOrder(): void {
    // Allow selecting a sales order to create invoice from
    const salesOrderId = prompt('Enter Sales Order ID:');
    if (salesOrderId) {
      this.invoiceService.createFromSalesOrder(parseInt(salesOrderId)).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Invoice created from sales order');
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to create invoice')
      });
    }
  }

  addItem(): void {
    this.items.push(this.fb.group({
      description: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required]],
      taxPercent: [18],
      notes: ['']
    }));
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateSubtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      return sum + (qty * price);
    }, 0);
  }

  calculateTax(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      const tax = item.get('taxPercent')?.value || 0;
      return sum + (qty * price * tax / 100);
    }, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const formValue = this.invoiceForm.value;
    const request: InvoiceRequest = {
      ...formValue,
      invoiceDate: new Date(formValue.invoiceDate).toISOString().split('T')[0],
      dueDate: new Date(formValue.dueDate).toISOString().split('T')[0]
    };

    if (this.isEditing && this.selectedInvoice) {
      this.invoiceService.update(this.selectedInvoice.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Invoice updated successfully');
            this.dialogVisible = false;
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to update invoice')
      });
    } else {
      this.invoiceService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Invoice created successfully');
            this.dialogVisible = false;
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to create invoice')
      });
    }
  }

  sendInvoice(invoice: Invoice): void {
    this.invoiceService.send(invoice.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Invoice sent to customer');
          this.loadInvoices();
        }
      },
      error: () => this.toastr.error('Failed to send invoice')
    });
  }

  markAsPaid(invoice: Invoice): void {
    const paymentDate = prompt('Enter payment date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (paymentDate) {
      this.invoiceService.markPaid(invoice.id, paymentDate).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success('Invoice marked as paid');
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to mark invoice as paid')
      });
    }
  }

  cancelInvoice(invoice: Invoice): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.invoiceService.cancel(invoice.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Invoice cancelled');
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to cancel invoice')
      });
    }
  }

  printInvoice(invoice: Invoice): void {
    this.invoiceService.downloadPdf(invoice.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.invoiceNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to download invoice')
    });
  }

  deleteInvoice(invoice: Invoice): void {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      this.invoiceService.delete(invoice.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Invoice deleted');
            this.loadInvoices();
          }
        },
        error: () => this.toastr.error('Failed to delete invoice')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'PAID': return 'success';
      case 'SENT':
      case 'PARTIAL_PAID': return 'info';
      case 'OVERDUE': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }
}
