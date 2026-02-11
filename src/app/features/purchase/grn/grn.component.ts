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
import { GRNService, PurchaseOrderService, SupplierService, RawMaterialService, WarehouseService, UnitService } from '../../../core/services';
import { GRN, GRNRequest } from '../../../core/models';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-grn',
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
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss',
})
export class GrnComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private grnService = inject(GRNService);
  private purchaseOrderService = inject(PurchaseOrderService);
  private supplierService = inject(SupplierService);
  private rawMaterialService = inject(RawMaterialService);
  private warehouseService = inject(WarehouseService);
  private unitService = inject(UnitService);

  grns = signal<GRN[]>([]);
  purchaseOrders = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  rawMaterials = signal<any[]>([]);
  filteredRawMaterials = signal<any[]>([]); // Filtered materials based on selected PO
  warehouses = signal<any[]>([]);
  units = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedGrn: GRN | null = null;
  selectedPurchaseOrder: any = null; // Store selected PO for filtering

  totalRecords = 0;
  rows = 10;
  first = 0;
  private isLoading = false; // Guard to prevent multiple API calls

  grnForm: FormGroup = this.fb.group({
    purchaseOrderId: [null],
    supplierId: [null, [Validators.required]],
    warehouseId: [null, [Validators.required]],
    receiptDate: [new Date(), [Validators.required]],
    vehicleNo: [''],
    driverName: [''],
    challanNo: [''],
    challanDate: [null],
    notes: [''],
    items: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadGrns();
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadRawMaterials();
    this.loadWarehouses();
    this.loadUnits();
  }

  get items(): FormArray {
    return this.grnForm.get('items') as FormArray;
  }

  loadGrns(): void {
    if (this.isLoading) return; // Prevent multiple concurrent calls
    this.isLoading = true;
    this.loading.set(true);
    this.grnService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.grns.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
        this.isLoading = false;
      },
      error: (err) => {
        this.loading.set(false);
        this.isLoading = false;
        this.toastr.error('Failed to load GRNs', 'Error');
        console.error('Error loading GRNs:', err);
      }
    });
  }

  loadPurchaseOrders(): void {
    this.purchaseOrderService.getAll({ page: 0, size: 100 }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.purchaseOrders.set(response.data.content.map(po => ({
            label: `${po.poNumber || po.orderNumber} - ${po.supplierName}`,
            value: po.id
          })));
        }
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
          const materials = response.data.map(rm => ({
            label: `${rm.code} - ${rm.name}`,
            value: rm.id,
            unitId: rm.unit?.id || rm.unitId, // Support both nested unit object and direct unitId
            unitSymbol: rm.unit?.symbol || rm.unitSymbol || rm.unit?.name || rm.unitName,
            unitName: rm.unit?.name || rm.unitName
          }));
          this.rawMaterials.set(materials);
          this.filteredRawMaterials.set(materials); // Initialize filtered list with all materials
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

  loadUnits(): void {
    this.unitService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.units.set(response.data.map(u => ({ label: `${u.name} (${u.symbol})`, value: u.id, symbol: u.symbol })));
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.grnService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.grns.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadGrns();
    }
  }

  onPageChange(event: any): void {
    // Only reload if page or rows actually changed
    if (this.first !== event.first || this.rows !== event.rows) {
      this.first = event.first;
      this.rows = event.rows;
      this.loadGrns();
    }
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedGrn = null;
    this.selectedPurchaseOrder = null;
    this.filteredRawMaterials.set(this.rawMaterials()); // Reset to show all materials
    this.grnForm.reset({
      receiptDate: new Date(),
      vehicleNo: '',
      driverName: '',
      challanNo: '',
      challanDate: null,
      notes: ''
    });
    this.items.clear();
    this.addItem();
    this.dialogVisible = true;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      rawMaterialId: [null, [Validators.required]],
      orderedQuantity: [0],
      receivedQuantity: [0, [Validators.required, Validators.min(0.001)]],
      acceptedQuantity: [0],
      rejectedQuantity: [0],
      unitId: [null, [Validators.required]],
      unitPrice: [0],
      batchNo: [''],
      lotNo: [''],
      manufacturingDate: [null],
      expiryDate: [null],
      qcStatus: ['PENDING'],
      rejectionReason: [''],
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
    if (material && material.unitId) {
      item.get('unitId')?.setValue(material.unitId);
    } else {
      // If unitId not found, show warning
      this.toastr.warning('Unit not found for selected raw material. Please select unit manually.', 'Warning');
    }
  }

  onPurchaseOrderSelect(): void {
    const poId = this.grnForm.get('purchaseOrderId')?.value;
    if (poId) {
      this.purchaseOrderService.getById(poId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const po = response.data;
            this.selectedPurchaseOrder = po;
            
            this.grnForm.patchValue({
              supplierId: po.supplierId,
              warehouseId: po.warehouseId
            });
            
            // Filter raw materials to only show PO materials
            if (po.items && po.items.length > 0) {
              const poMaterialIds = po.items.map((item: any) => item.rawMaterialId);
              const filtered = this.rawMaterials().filter(m => poMaterialIds.includes(m.value));
              this.filteredRawMaterials.set(filtered);
            } else {
              this.filteredRawMaterials.set([]);
            }
            
            // Load PO items into GRN items
            this.items.clear();
            po.items?.forEach((poItem: any) => {
              // Get unitId from PO item if available, otherwise from raw material
              const rawMaterial = this.rawMaterials().find(m => m.value === poItem.rawMaterialId);
              const unitId = poItem.unitId || rawMaterial?.unitId || null;
              
              if (!unitId) {
                this.toastr.warning(`Unit not found for raw material ${poItem.rawMaterialName || poItem.rawMaterialId}. Please select unit manually.`, 'Warning');
              }
              
              this.items.push(this.fb.group({
                rawMaterialId: poItem.rawMaterialId,
                orderedQuantity: poItem.quantity,
                receivedQuantity: poItem.quantity,
                acceptedQuantity: poItem.quantity,
                rejectedQuantity: 0,
                unitId: [unitId, [Validators.required]],
                unitPrice: poItem.unitPrice,
                batchNo: '',
                lotNo: '',
                manufacturingDate: null,
                expiryDate: null,
                qcStatus: 'PENDING',
                rejectionReason: '',
                notes: poItem.notes || ''
              }));
            });
          }
        },
        error: (err) => {
          this.toastr.error('Failed to load purchase order details', 'Error');
          console.error('Error loading purchase order:', err);
        }
      });
    } else {
      // PO cleared - show all materials again
      this.selectedPurchaseOrder = null;
      this.filteredRawMaterials.set(this.rawMaterials());
      // Clear items if PO is removed
      this.items.clear();
      this.addItem();
    }
  }

  saveGrn(): void {
    if (this.grnForm.invalid) {
      this.grnForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    const formValue = this.grnForm.value;
    const request: GRNRequest = {
      purchaseOrderId: formValue.purchaseOrderId || undefined,
      supplierId: formValue.supplierId,
      warehouseId: formValue.warehouseId,
      receiptDate: this.formatDate(formValue.receiptDate),
      vehicleNo: formValue.vehicleNo || undefined,
      driverName: formValue.driverName || undefined,
      challanNo: formValue.challanNo || undefined,
      challanDate: formValue.challanDate ? this.formatDate(formValue.challanDate) : undefined,
      notes: formValue.notes || undefined,
      items: formValue.items.map((item: any) => {
        if (!item.unitId) {
          const material = this.rawMaterials().find(m => m.value === item.rawMaterialId);
          const materialName = material?.label || `ID: ${item.rawMaterialId}`;
          this.toastr.error(`Unit is required for raw material: ${materialName}. Please select a unit.`, 'Validation Error');
          throw new Error(`Unit ID is required for raw material ${item.rawMaterialId}`);
        }
        return {
          rawMaterialId: item.rawMaterialId,
          orderedQuantity: item.orderedQuantity || undefined,
          receivedQuantity: item.receivedQuantity,
          acceptedQuantity: item.acceptedQuantity || item.receivedQuantity,
          rejectedQuantity: item.rejectedQuantity || undefined,
          unitId: item.unitId,
          unitPrice: item.unitPrice || undefined,
          batchNumber: item.batchNo || undefined,
          lotNo: item.lotNo || undefined,
          manufacturingDate: item.manufacturingDate ? this.formatDate(item.manufacturingDate) : undefined,
          expiryDate: item.expiryDate ? this.formatDate(item.expiryDate) : undefined,
          qcStatus: item.qcStatus || 'PENDING',
          rejectionReason: item.rejectionReason || undefined,
          notes: item.notes || undefined
        };
      })
    };

    if (this.isEditing && this.selectedGrn) {
      this.grnService.update(this.selectedGrn.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('GRN updated successfully');
            this.dialogVisible = false;
            this.loadGrns();
          }
        },
        error: (error) => {
          console.error('Error updating GRN:', error);
          const errorMsg = error?.error?.message || 'Failed to update GRN';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    } else {
      this.grnService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('GRN created successfully');
            this.dialogVisible = false;
            this.loadGrns();
          }
        },
        error: (error) => {
          console.error('Error creating GRN:', error);
          const errorMsg = error?.error?.message || 'Failed to create GRN';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  verifyGrn(grn: GRN): void {
    if (confirm(`Verify GRN ${grn.grnNumber}? This will add stock to raw materials.`)) {
      this.grnService.verify(grn.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('GRN verified and stock added to raw materials');
            this.loadGrns();
          }
        },
        error: (err) => {
          this.toastr.error(`Failed to verify: ${err.error?.error?.message || err.message}`);
        }
      });
    }
  }

  cancelGrn(grn: GRN): void {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      this.grnService.cancel(grn.id, reason).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('GRN cancelled');
            this.loadGrns();
          }
        },
        error: (err) => {
          this.toastr.error(`Failed to cancel: ${err.error?.error?.message || err.message}`);
        }
      });
    }
  }

  deleteGrn(grn: GRN): void {
    if (confirm(`Are you sure you want to delete GRN ${grn.grnNumber}?`)) {
      this.grnService.delete(grn.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('GRN deleted');
            this.loadGrns();
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
      case 'VERIFIED':
      case 'QC_COMPLETED': return 'success';
      case 'PENDING_QC':
      case 'QC_IN_PROGRESS': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'DRAFT': return 'secondary';
      default: return 'info';
    }
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }
}
