import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastrService } from 'ngx-toastr';
import { BOMService, FinishedGoodsService } from '../../../core/services';
import { BOM, BOMRequest } from '../../../core/models';

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
    TagModule, 
    DialogModule,
    DropdownModule
  ],
  templateUrl: './bom.component.html',
  styleUrl: './bom.component.scss',
})
export class BomComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private bomService = inject(BOMService);
  private finishedGoodsService = inject(FinishedGoodsService);

  boms = signal<BOM[]>([]);
  finishedGoods = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';
  dialogVisible = false;
  isEditing = false;
  selectedBom: BOM | null = null;

  totalRecords = 0;
  rows = 10;
  first = 0;

  bomForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    finishedGoodsId: [null, [Validators.required]],
    version: ['1.0'],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitId: [null],
    laborCost: [0],
    overheadCost: [0],
    notes: ['']
  });

  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  ngOnInit(): void {
    this.loadBoms();
    this.loadFinishedGoods();
  }

  loadBoms(): void {
    this.loading.set(true);
    this.bomService.getAll({ page: this.first / this.rows, size: this.rows }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.boms.set(response.data.content);
          this.totalRecords = response.data.totalElements;
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load BOMs');
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
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.bomService.search(this.searchTerm, { page: 0, size: this.rows }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.boms.set(response.data.content);
            this.totalRecords = response.data.totalElements;
          }
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
    this.bomForm.reset({ version: '1.0', quantity: 1, laborCost: 0, overheadCost: 0 });
    this.dialogVisible = true;
  }

  editBom(bom: BOM): void {
    this.isEditing = true;
    this.selectedBom = bom;
    this.bomForm.patchValue({
      code: bom.code,
      name: bom.name,
      description: bom.description,
      finishedGoodsId: bom.finishedGoodsId,
      version: bom.version,
      quantity: bom.quantity,
      unitId: bom.unitId,
      laborCost: bom.laborCost,
      overheadCost: bom.overheadCost,
      notes: bom.notes
    });
    this.dialogVisible = true;
  }

  saveBom(): void {
    if (this.bomForm.invalid) {
      this.bomForm.markAllAsTouched();
      return;
    }

    const request: BOMRequest = this.bomForm.value;

    if (this.isEditing && this.selectedBom) {
      this.bomService.update(this.selectedBom.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM updated successfully');
            this.dialogVisible = false;
            this.loadBoms();
          }
        },
        error: () => this.toastr.error('Failed to update BOM')
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
        error: () => this.toastr.error('Failed to create BOM')
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
        error: () => this.toastr.error('Failed to delete BOM')
      });
    }
  }

  duplicateBom(bom: BOM): void {
    const newVersion = prompt('Enter new version number:', `${parseFloat(bom.version) + 0.1}`);
    if (newVersion) {
      this.bomService.duplicate(bom.id, newVersion).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('BOM duplicated successfully');
            this.loadBoms();
          }
        },
        error: () => this.toastr.error('Failed to duplicate BOM')
      });
    }
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'warning';
      case 'INACTIVE':
      case 'OBSOLETE': return 'danger';
      default: return 'info';
    }
  }
}
