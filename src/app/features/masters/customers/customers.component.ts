import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer, CustomerRequest } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    TagModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedCustomer: Customer | null = null;

  customerTypes = [
    { label: 'Regular', value: 'REGULAR' },
    { label: 'Distributor', value: 'DISTRIBUTOR' },
    { label: 'Corporate', value: 'CORPORATE' },
    { label: 'Retail', value: 'RETAIL' },
  ];

  customerForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    customerType: ['REGULAR'],
    contactPerson: [''],
    phone: [''],
    email: ['', Validators.email],
    billingAddress: [''],
    billingCity: [''],
    billingState: [''],
    billingCountry: ['India'],
    billingPincode: [''],
    gstNo: [''],
    panNo: [''],
    creditLimit: [0],
    paymentTerms: [30],
    discountPercent: [0],
  });

  ngOnInit(): void {}

  loadCustomers(event?: any): void {
    this.loading.set(true);
    const pageRequest = {
      page: event?.first ? event.first / event.rows : 0,
      size: event?.rows || 10,
      sort: event?.sortField || 'name',
      direction: (event?.sortOrder === 1 ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const request = this.searchTerm
      ? this.customerService.search(this.searchTerm, pageRequest)
      : this.customerService.getAll(pageRequest);

    request.subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.customers.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customers' });
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.loadCustomers();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedCustomer = null;
    this.customerForm.reset({ customerType: 'REGULAR', billingCountry: 'India', paymentTerms: 30 });
    this.dialogVisible = true;
  }

  editCustomer(customer: Customer): void {
    this.editMode = true;
    this.selectedCustomer = customer;
    this.customerForm.patchValue(customer);
    this.dialogVisible = true;
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) return;
    this.saving.set(true);
    const request: CustomerRequest = this.customerForm.value;

    const operation =
      this.editMode && this.selectedCustomer
        ? this.customerService.update(this.selectedCustomer.id, request)
        : this.customerService.create(request);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Customer ${this.editMode ? 'updated' : 'created'} successfully`,
          });
          this.dialogVisible = false;
          this.loadCustomers();
        }
        this.saving.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to save customer',
        });
        this.saving.set(false);
      },
    });
  }

  confirmDelete(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete customer "${customer.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCustomer(customer),
    });
  }

  deleteCustomer(customer: Customer): void {
    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully' });
        this.loadCustomers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
      },
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }
}
