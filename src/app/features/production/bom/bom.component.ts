import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastrService } from 'ngx-toastr';
import { BOMService, FinishedGoodsService, RawMaterialService, UnitService } from '../../../core/services';
import { BOM, BOMRequest, BOMItem, BOMItemRequest } from '../../../core/models';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    InputTextModule,
    InputNumberModule,
    TagModule, 
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule
  ],
  templateUrl: './bom.component.html',
  styleUrl: './bom.component.scss',
})
export class BomComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private bomService = inject(BOMService);
  private finishedGoodsService = inject(FinishedGoodsService);
  private rawMaterialService = inject(RawMaterialService);
  private unitService = inject(UnitService);

  boms = signal<BOM[]>([]);
  finishedGoods = signal<any[]>([]);
  rawMaterials = signal<any[]>([]);
  units = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  itemDialogVisible = false;
  isEditing = false;
  selectedBom: BOM | null = null;
  editingItemIndex: number | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  bomForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    finishedGoodsId: [null, [Validators.required]],
    version: ['1.0', [Validators.required]],
    description: [''],
    outputQuantity: [1, [Validators.required, Validators.min(0.001)]],
    outputUnitId: [null],
    effectiveFrom: [null],
    effectiveTo: [null],
    standardTimeMinutes: [0],
    setupTimeMinutes: [0],
    isActive: [true]
  });

  itemForm: FormGroup = this.fb.group({
    itemType: ['RAW_MATERIAL', [Validators.required]],
    itemId: [null, [Validators.required]],
    sequenceNo: [0],
    quantity: [0, [Validators.required, Validators.min(0.001)]],
    unitId: [null, [Validators.required]],
    wastagePercent: [0],
    isCritical: [false],
    notes: ['']
  });

  bomItems: BOMItem[] = [];
  itemTypeOptions = [
    { label: 'Raw Material', value: 'RAW_MATERIAL' },
    { label: 'In-Process', value: 'IN_PROCESS' },
    { label: 'Sub-Assembly', value: 'SUB_ASSEMBLY' }
  ];

  ngOnInit(): void {
    this.loadBoms();
    this.loadFinishedGoods();
    this.loadRawMaterials();
    this.loadUnits();
  }

  loadBoms(): void {
    this.loading.set(true);
    this.bomService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.boms.set(response.data.content || []);
          this.totalRecords = response.data.totalElements || 0;
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading BOMs:', error);
        this.loading.set(false);
        this.toastr.error('Failed to load BOMs', 'Error');
      }
    });
  }

  loadFinishedGoods(): void {
    this.finishedGoodsService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.finishedGoods.set(response.data.map(fg => ({ 
            label: `${fg.code} - ${fg.name}`, 
            value: fg.id 
          })));
        }
      },
      error: (error) => {
        console.error('Error loading finished goods:', error);
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
            unitId: rm.unitId
          })));
        }
      },
      error: (error) => {
        console.error('Error loading raw materials:', error);
      }
    });
  }

  loadUnits(): void {
    this.unitService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.units.set(response.data.map(u => ({ 
            label: `${u.name} (${u.symbol})`, 
            value: u.id 
          })));
        }
      },
      error: (error) => {
        console.error('Error loading units:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.bomService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.boms.set(response.data.content || []);
            this.totalRecords = response.data.totalElements || 0;
          }
        },
        error: (error) => {
          console.error('Error searching BOMs:', error);
          this.toastr.error('Failed to search BOMs', 'Error');
        }
      });
    } else {
      this.loadBoms();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadBoms();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedBom = null;
    this.bomItems = [];
    this.bomForm.reset({ 
      version: '1.0', 
      outputQuantity: 1, 
      standardTimeMinutes: 0,
      setupTimeMinutes: 0,
      isActive: true 
    });
    this.dialogVisible = true;
  }

  editBom(bom: BOM): void {
    this.isEditing = true;
    this.selectedBom = bom;
    this.bomItems = bom.items || [];
    
    this.bomForm.patchValue({
      code: bom.code,
      finishedGoodsId: bom.finishedGoodsId,
      version: bom.version,
      description: bom.description || '',
      outputQuantity: bom.outputQuantity || 1,
      outputUnitId: bom.outputUnitId,
      effectiveFrom: bom.effectiveFrom ? new Date(bom.effectiveFrom) : null,
      effectiveTo: bom.effectiveTo ? new Date(bom.effectiveTo) : null,
      standardTimeMinutes: bom.standardTimeMinutes || 0,
      setupTimeMinutes: bom.setupTimeMinutes || 0,
      isActive: bom.isActive
    });
    
    this.dialogVisible = true;
  }

  viewBom(bom: BOM): void {
    this.bomService.getById(bom.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.selectedBom = response.data;
          this.bomItems = response.data.items || [];
          this.dialogVisible = true;
        }
      },
      error: (error) => {
        console.error('Error loading BOM details:', error);
        this.toastr.error('Failed to load BOM details', 'Error');
      }
    });
  }

  saveBom(): void {
    if (this.bomForm.invalid) {
      this.bomForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    const formValue = this.bomForm.value;
    const request: BOMRequest = {
      code: formValue.code,
      finishedGoodsId: formValue.finishedGoodsId,
      version: formValue.version,
      description: formValue.description || undefined,
      outputQuantity: formValue.outputQuantity,
      outputUnitId: formValue.outputUnitId || undefined,
      effectiveFrom: formValue.effectiveFrom ? this.formatDate(formValue.effectiveFrom) : undefined,
      effectiveTo: formValue.effectiveTo ? this.formatDate(formValue.effectiveTo) : undefined,
      standardTimeMinutes: formValue.standardTimeMinutes || undefined,
      setupTimeMinutes: formValue.setupTimeMinutes || undefined,
      isActive: formValue.isActive,
      items: this.bomItems.map(item => ({
        itemType: item.itemType,
        itemId: item.itemId,
        sequenceNo: item.sequenceNo || 0,
        quantity: item.quantity,
        unitId: item.unitId,
        wastagePercent: item.wastagePercent || 0,
        isCritical: item.isCritical || false,
        notes: item.notes || undefined
      }))
    };

    if (this.isEditing && this.selectedBom) {
      this.bomService.update(this.selectedBom.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM updated successfully');
            this.dialogVisible = false;
            this.loadBoms();
          }
        },
        error: (error) => {
          console.error('Error updating BOM:', error);
          const errorMsg = error?.error?.message || 'Failed to update BOM';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    } else {
      this.bomService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM created successfully');
            this.dialogVisible = false;
            this.loadBoms();
          }
        },
        error: (error) => {
          console.error('Error creating BOM:', error);
          const errorMsg = error?.error?.message || 'Failed to create BOM';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  deleteBom(bom: BOM): void {
    if (confirm(`Are you sure you want to delete BOM ${bom.code}?`)) {
      this.bomService.delete(bom.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM deleted successfully');
            this.loadBoms();
          }
        },
        error: (error) => {
          console.error('Error deleting BOM:', error);
          const errorMsg = error?.error?.message || 'Failed to delete BOM';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  duplicateBom(bom: BOM): void {
    const newVersion = prompt('Enter new version number:', `${parseFloat(bom.version || '1.0') + 0.1}`);
    if (newVersion) {
      this.bomService.duplicate(bom.id, newVersion).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM duplicated successfully');
            this.loadBoms();
          }
        },
        error: (error) => {
          console.error('Error duplicating BOM:', error);
          const errorMsg = error?.error?.message || 'Failed to duplicate BOM';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }

  activateBom(bom: BOM): void {
    this.bomService.activate(bom.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('BOM activated successfully');
          this.loadBoms();
        }
      },
      error: (error) => {
        console.error('Error activating BOM:', error);
        this.toastr.error('Failed to activate BOM', 'Error');
      }
    });
  }

  deactivateBom(bom: BOM): void {
    this.bomService.deactivate(bom.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('BOM deactivated successfully');
          this.loadBoms();
        }
      },
      error: (error) => {
        console.error('Error deactivating BOM:', error);
        this.toastr.error('Failed to deactivate BOM', 'Error');
      }
    });
  }

  // BOM Items Management
  showItemDialog(index?: number): void {
    this.editingItemIndex = index !== undefined ? index : null;
    if (index !== undefined && this.bomItems[index]) {
      const item = this.bomItems[index];
      this.itemForm.patchValue({
        itemType: item.itemType,
        itemId: item.itemId,
        sequenceNo: item.sequenceNo || 0,
        quantity: item.quantity,
        unitId: item.unitId,
        wastagePercent: item.wastagePercent || 0,
        isCritical: item.isCritical || false,
        notes: item.notes || ''
      });
    } else {
      this.itemForm.reset({
        itemType: 'RAW_MATERIAL',
        sequenceNo: this.bomItems.length,
        quantity: 0,
        wastagePercent: 0,
        isCritical: false
      });
    }
    this.itemDialogVisible = true;
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Validation Error');
      return;
    }

    const formValue = this.itemForm.value;
    const selectedMaterial = this.rawMaterials().find(m => m.value === formValue.itemId);
    
    const item: BOMItem = {
      id: this.editingItemIndex !== null && this.bomItems[this.editingItemIndex] ? this.bomItems[this.editingItemIndex].id : 0,
      itemType: formValue.itemType,
      itemId: formValue.itemId,
      itemCode: selectedMaterial?.label?.split(' - ')[0],
      itemName: selectedMaterial?.label?.split(' - ')[1],
      sequenceNo: formValue.sequenceNo || 0,
      quantity: formValue.quantity,
      unitId: formValue.unitId,
      wastagePercent: formValue.wastagePercent || 0,
      isCritical: formValue.isCritical || false,
      notes: formValue.notes || undefined
    };

    if (this.editingItemIndex !== null) {
      this.bomItems[this.editingItemIndex] = item;
    } else {
      this.bomItems.push(item);
    }

    this.itemDialogVisible = false;
    this.itemForm.reset();
  }

  deleteItem(index: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.bomItems.splice(index, 1);
    }
  }

  onMaterialChange(): void {
    const materialId = this.itemForm.get('itemId')?.value;
    const material = this.rawMaterials().find(m => m.value === materialId);
    if (material && material.unitId) {
      this.itemForm.patchValue({ unitId: material.unitId });
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }

  getStatusSeverity(status: string | undefined): 'success' | 'warning' | 'danger' | 'info' {
    if (!status) return 'info';
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'warning';
      case 'INACTIVE':
      case 'OBSOLETE': return 'danger';
      default: return 'info';
    }
  }

  getProductName(bom: BOM): string {
    return bom.finishedGoodsName || bom.finishedGoodsCode || '-';
  }

  getComponentCount(bom: BOM): number {
    return bom.items?.length || 0;
  }

  getUnitCost(bom: BOM): number {
    return bom.totalCost || bom.totalMaterialCost || 0;
  }
}
