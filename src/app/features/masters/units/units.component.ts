import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UnitService } from '../../../core/services';
import { Unit, UnitRequest } from '../../../core/models';

@Component({
  selector: 'app-units',
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
    InputNumberModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private unitService = inject(UnitService);

  units = signal<Unit[]>([]);
  baseUnits = signal<any[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedUnit: Unit | null = null;
  rows = 10;
  first = 0;

  unitForm: FormGroup = this.fb.group({
    code: [''],
    name: ['', [Validators.required]],
    symbol: ['', [Validators.required]],
    type: ['QUANTITY', [Validators.required]],
    baseUnitId: [null],
    conversionFactor: [1],
    isActive: [true]
  });

  unitTypes = [
    { label: 'Quantity', value: 'QUANTITY' },
    { label: 'Weight', value: 'WEIGHT' },
    { label: 'Length', value: 'LENGTH' },
    { label: 'Volume', value: 'VOLUME' },
    { label: 'Area', value: 'AREA' }
  ];

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(event?: any): void {
    this.loading.set(true);
    const page = event?.first ? event.first / event.rows : 0;
    const size = event?.rows || this.rows;
    
    this.unitService.getAll({ page, size }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.units.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
          // Load base units for dropdown
          this.baseUnits.set(response.data.content
            .filter((u: Unit) => !u.baseUnitId)
            .map((u: Unit) => ({ id: u.id, name: `${u.name} (${u.symbol})` })));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load units' });
      }
    });
  }

  onSearch(): void {
    this.loadUnits();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedUnit = null;
    this.unitForm.reset({ type: 'QUANTITY', conversionFactor: 1, isActive: true });
    this.dialogVisible = true;
  }

  editUnit(unit: Unit): void {
    this.editMode = true;
    this.selectedUnit = unit;
    this.unitForm.patchValue({
      code: unit.code,
      name: unit.name,
      symbol: unit.symbol,
      type: unit.type,
      baseUnitId: unit.baseUnitId,
      conversionFactor: unit.conversionFactor,
      isActive: unit.isActive
    });
    this.dialogVisible = true;
  }

  saveUnit(): void {
    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const request: UnitRequest = this.unitForm.value;

    if (this.editMode && this.selectedUnit) {
      this.unitService.update(this.selectedUnit.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit updated successfully' });
            this.dialogVisible = false;
            this.loadUnits();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update unit' });
          this.saving.set(false);
        }
      });
    } else {
      this.unitService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit created successfully' });
            this.dialogVisible = false;
            this.loadUnits();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create unit' });
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(unit: Unit): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete unit "${unit.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUnit(unit)
    });
  }

  deleteUnit(unit: Unit): void {
    this.unitService.delete(unit.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit deleted successfully' });
          this.loadUnits();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete unit' })
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  toggleStatus(unit: Unit): void {
    const action = unit.isActive ? 
      this.unitService.deactivate(unit.id) : 
      this.unitService.activate(unit.id);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: `Unit ${unit.isActive ? 'deactivated' : 'activated'} successfully` 
          });
          this.loadUnits();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' })
    });
  }

  getTypeSeverity(type: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (type) {
      case 'QUANTITY': return 'info';
      case 'WEIGHT': return 'success';
      case 'LENGTH': return 'warning';
      case 'VOLUME': return 'danger';
      case 'AREA': return 'info';
      default: return 'info';
    }
  }
}
