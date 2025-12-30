import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WarehouseService } from '../../../core/services';
import { Warehouse, WarehouseRequest } from '../../../core/models';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    InputTextModule,
    InputTextareaModule, 
    TagModule, 
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.scss',
})
export class WarehousesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private warehouseService = inject(WarehouseService);

  warehouses = signal<Warehouse[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedWarehouse: Warehouse | null = null;
  rows = 10;
  first = 0;

  warehouseForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: ['MAIN', [Validators.required]],
    address: [''],
    city: [''],
    state: [''],
    pincode: [''],
    contactPerson: [''],
    contactPhone: [''],
    contactEmail: ['', [Validators.email]],
    isActive: [true]
  });

  warehouseTypes = [
    { label: 'Main Warehouse', value: 'MAIN' },
    { label: 'Raw Material Store', value: 'RAW_MATERIAL' },
    { label: 'Finished Goods Store', value: 'FINISHED_GOODS' },
    { label: 'Work in Progress', value: 'WIP' },
    { label: 'Transit', value: 'TRANSIT' },
    { label: 'Scrap', value: 'SCRAP' }
  ];

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(event?: any): void {
    this.loading.set(true);
    const page = event?.first ? event.first / event.rows : 0;
    const size = event?.rows || this.rows;
    
    this.warehouseService.getAll({ page, size }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.warehouses.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load warehouses' });
      }
    });
  }

  onSearch(): void {
    this.loadWarehouses();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedWarehouse = null;
    this.warehouseForm.reset({ type: 'MAIN', isActive: true });
    this.dialogVisible = true;
  }

  editWarehouse(warehouse: Warehouse): void {
    this.editMode = true;
    this.selectedWarehouse = warehouse;
    this.warehouseForm.patchValue({
      code: warehouse.code,
      name: warehouse.name,
      type: warehouse.type,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      pincode: warehouse.pincode,
      contactPerson: warehouse.contactPerson,
      contactPhone: warehouse.contactPhone,
      contactEmail: warehouse.contactEmail,
      isActive: warehouse.isActive
    });
    this.dialogVisible = true;
  }

  saveWarehouse(): void {
    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const request: WarehouseRequest = this.warehouseForm.value;

    if (this.editMode && this.selectedWarehouse) {
      this.warehouseService.update(this.selectedWarehouse.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Warehouse updated successfully' });
            this.dialogVisible = false;
            this.loadWarehouses();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update warehouse' });
          this.saving.set(false);
        }
      });
    } else {
      this.warehouseService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Warehouse created successfully' });
            this.dialogVisible = false;
            this.loadWarehouses();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create warehouse' });
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(warehouse: Warehouse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete warehouse "${warehouse.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteWarehouse(warehouse)
    });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    this.warehouseService.delete(warehouse.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Warehouse deleted successfully' });
          this.loadWarehouses();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete warehouse' })
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  toggleStatus(warehouse: Warehouse): void {
    const action = warehouse.isActive ? 
      this.warehouseService.deactivate(warehouse.id) : 
      this.warehouseService.activate(warehouse.id);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: `Warehouse ${warehouse.isActive ? 'deactivated' : 'activated'} successfully` 
          });
          this.loadWarehouses();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' })
    });
  }

  getTypeSeverity(type: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (type) {
      case 'MAIN': return 'success';
      case 'RAW_MATERIAL': return 'info';
      case 'FINISHED_GOODS': return 'success';
      case 'WIP': return 'warning';
      case 'TRANSIT': return 'info';
      case 'SCRAP': return 'danger';
      default: return 'info';
    }
  }
}
