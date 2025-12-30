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
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier, SupplierRequest } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-suppliers',
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
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  suppliers = signal<Supplier[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedSupplier: Supplier | null = null;

  supplierForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    contactPerson: [''],
    phone: [''],
    email: ['', Validators.email],
    address: [''],
    city: [''],
    state: [''],
    country: ['India'],
    pincode: [''],
    gstNo: [''],
    panNo: [''],
    bankName: [''],
    bankAccountNo: [''],
    bankIfsc: [''],
    paymentTerms: [30],
  });

  ngOnInit(): void {}

  loadSuppliers(event?: any): void {
    this.loading.set(true);
    const pageRequest = {
      page: event?.first ? event.first / event.rows : 0,
      size: event?.rows || 10,
      sort: event?.sortField || 'name',
      direction: (event?.sortOrder === 1 ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const request = this.searchTerm
      ? this.supplierService.search(this.searchTerm, pageRequest)
      : this.supplierService.getAll(pageRequest);

    request.subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.suppliers.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load suppliers' });
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.loadSuppliers();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedSupplier = null;
    this.supplierForm.reset({ country: 'India', paymentTerms: 30 });
    this.dialogVisible = true;
  }

  editSupplier(supplier: Supplier): void {
    this.editMode = true;
    this.selectedSupplier = supplier;
    this.supplierForm.patchValue(supplier);
    this.dialogVisible = true;
  }

  saveSupplier(): void {
    if (this.supplierForm.invalid) return;
    this.saving.set(true);
    const request: SupplierRequest = this.supplierForm.value;

    const operation =
      this.editMode && this.selectedSupplier
        ? this.supplierService.update(this.selectedSupplier.id, request)
        : this.supplierService.create(request);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Supplier ${this.editMode ? 'updated' : 'created'} successfully`,
          });
          this.dialogVisible = false;
          this.loadSuppliers();
        }
        this.saving.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to save supplier',
        });
        this.saving.set(false);
      },
    });
  }

  confirmDelete(supplier: Supplier): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete supplier "${supplier.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteSupplier(supplier),
    });
  }

  deleteSupplier(supplier: Supplier): void {
    this.supplierService.delete(supplier.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
        this.loadSuppliers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete supplier' });
      },
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }
}
