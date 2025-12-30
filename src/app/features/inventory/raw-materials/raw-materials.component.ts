import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastrService } from 'ngx-toastr';
import { RawMaterialService, CategoryService, UnitService, SupplierService } from '../../../core/services';
import { RawMaterial, RawMaterialRequest } from '../../../core/models';

@Component({
  selector: 'app-raw-materials',
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
    InputNumberModule
  ],
  templateUrl: './raw-materials.component.html',
  styleUrl: './raw-materials.component.scss',
})
export class RawMaterialsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private rawMaterialService = inject(RawMaterialService);
  private categoryService = inject(CategoryService);
  private unitService = inject(UnitService);
  private supplierService = inject(SupplierService);

  materials = signal<RawMaterial[]>([]);
  categories = signal<any[]>([]);
  units = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedMaterial: RawMaterial | null = null;
  
  // Pagination
  totalRecords = 0;
  rows = 10;
  first = 0;

  materialForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    categoryId: [null],
    unitId: [null, [Validators.required]],
    hsnCode: [''],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0],
    reorderQuantity: [0],
    leadTimeDays: [0],
    taxPercent: [18],
    supplierId: [null],
    barcode: [''],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCategories();
    this.loadUnits();
    this.loadSuppliers();
  }

  loadMaterials(): void {
    this.loading.set(true);
    this.rawMaterialService.getAll({ 
      page: this.first / this.rows, 
      size: this.rows 
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.materials.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load materials');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getByType('RAW_MATERIAL').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories.set(response.data.map(c => ({ label: c.name, value: c.id })));
        }
      }
    });
  }

  loadUnits(): void {
    this.unitService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.units.set(response.data.map(u => ({ label: `${u.name} (${u.symbol})`, value: u.id })));
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

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.rawMaterialService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.materials.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
        }
      });
    } else {
      this.loadMaterials();
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadMaterials();
  }

  showDialog(): void {
    this.isEditing = false;
    this.selectedMaterial = null;
    this.materialForm.reset({ isActive: true, taxPercent: 18 });
    this.dialogVisible = true;
  }

  editMaterial(material: RawMaterial): void {
    this.isEditing = true;
    this.selectedMaterial = material;
    this.materialForm.patchValue({
      code: material.code,
      name: material.name,
      description: material.description,
      categoryId: material.categoryId,
      unitId: material.unitId,
      hsnCode: material.hsnCode,
      unitPrice: material.unitPrice,
      reorderLevel: material.reorderLevel,
      reorderQuantity: material.reorderQuantity,
      leadTimeDays: material.leadTimeDays,
      taxPercent: material.taxPercent,
      supplierId: material.supplierId,
      barcode: material.barcode,
      isActive: material.isActive
    });
    this.dialogVisible = true;
  }

  saveMaterial(): void {
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched();
      return;
    }

    const request: RawMaterialRequest = this.materialForm.value;

    if (this.isEditing && this.selectedMaterial) {
      this.rawMaterialService.update(this.selectedMaterial.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Material updated successfully');
            this.dialogVisible = false;
            this.loadMaterials();
          }
        },
        error: () => {
          this.toastr.error('Failed to update material');
        }
      });
    } else {
      this.rawMaterialService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Material created successfully');
            this.dialogVisible = false;
            this.loadMaterials();
          }
        },
        error: () => {
          this.toastr.error('Failed to create material');
        }
      });
    }
  }

  deleteMaterial(material: RawMaterial): void {
    if (confirm(`Are you sure you want to delete ${material.name}?`)) {
      this.rawMaterialService.delete(material.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Material deleted successfully');
            this.loadMaterials();
          }
        },
        error: () => {
          this.toastr.error('Failed to delete material');
        }
      });
    }
  }

  toggleStatus(material: RawMaterial): void {
    const action = material.isActive ? 
      this.rawMaterialService.deactivate(material.id) : 
      this.rawMaterialService.activate(material.id);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(`Material ${material.isActive ? 'deactivated' : 'activated'} successfully`);
          this.loadMaterials();
        }
      },
      error: () => {
        this.toastr.error('Failed to update status');
      }
    });
  }
}
