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
import { CategoryService } from '../../../core/services';
import { Category, CategoryRequest } from '../../../core/models';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  parentCategories = signal<any[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedCategory: Category | null = null;
  rows = 10;
  first = 0;

  categoryForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    type: ['RAW_MATERIAL', [Validators.required]],
    parentId: [null],
    isActive: [true]
  });

  categoryTypes = [
    { label: 'Raw Material', value: 'RAW_MATERIAL' },
    { label: 'Finished Goods', value: 'FINISHED_GOODS' },
    { label: 'Work in Progress', value: 'WORK_IN_PROGRESS' },
    { label: 'Consumables', value: 'CONSUMABLES' }
  ];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(event?: any): void {
    this.loading.set(true);
    const page = event?.first ? event.first / event.rows : 0;
    const size = event?.rows || this.rows;
    
    this.categoryService.getAll({ page, size }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
          this.parentCategories.set(response.data.content.map((c: Category) => ({ 
            id: c.id, 
            name: c.name 
          })));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      }
    });
  }

  onSearch(): void {
    this.loadCategories();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset({ type: 'RAW_MATERIAL', isActive: true });
    this.dialogVisible = true;
  }

  editCategory(category: Category): void {
    this.editMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      code: category.code,
      name: category.name,
      description: category.description,
      type: category.type,
      parentId: category.parentId,
      isActive: category.isActive
    });
    this.dialogVisible = true;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const request: CategoryRequest = this.categoryForm.value;

    if (this.editMode && this.selectedCategory) {
      this.categoryService.update(this.selectedCategory.id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
            this.dialogVisible = false;
            this.loadCategories();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
          this.saving.set(false);
        }
      });
    } else {
      this.categoryService.create(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created successfully' });
            this.dialogVisible = false;
            this.loadCategories();
          }
          this.saving.set(false);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category' });
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete category "${category.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategory(category)
    });
  }

  deleteCategory(category: Category): void {
    this.categoryService.delete(category.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
          this.loadCategories();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' })
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  toggleStatus(category: Category): void {
    const action = category.isActive ? 
      this.categoryService.deactivate(category.id) : 
      this.categoryService.activate(category.id);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: `Category ${category.isActive ? 'deactivated' : 'activated'} successfully` 
          });
          this.loadCategories();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' })
    });
  }

  getTypeSeverity(type: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (type) {
      case 'RAW_MATERIAL': return 'info';
      case 'FINISHED_GOODS': return 'success';
      case 'WORK_IN_PROGRESS': return 'warning';
      case 'CONSUMABLES': return 'danger';
      default: return 'info';
    }
  }
}
