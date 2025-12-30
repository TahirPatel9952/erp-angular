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
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FinishedGoodsService } from '../../../core/services/finished-goods.service';
import { CategoryService } from '../../../core/services/category.service';
import { UnitService } from '../../../core/services/unit.service';
import { FinishedGoods, FinishedGoodsRequest } from '../../../core/models/finished-goods.model';
import { Category } from '../../../core/models/category.model';
import { Unit } from '../../../core/models/unit.model';

@Component({
  selector: 'app-finished-goods',
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
    CheckboxModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './finished-goods.component.html',
  styleUrl: './finished-goods.component.scss',
})
export class FinishedGoodsComponent implements OnInit {
  private productService = inject(FinishedGoodsService);
  private categoryService = inject(CategoryService);
  private unitService = inject(UnitService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  products = signal<FinishedGoods[]>([]);
  categories = signal<Category[]>([]);
  units = signal<Unit[]>([]);
  loading = signal(false);
  saving = signal(false);
  totalRecords = signal(0);
  searchTerm = '';
  dialogVisible = false;
  editMode = false;
  selectedProduct: FinishedGoods | null = null;

  productForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    categoryId: [null],
    unitId: [null, Validators.required],
    hsnCode: [''],
    barcode: [''],
    sellingPrice: [0, Validators.required],
    minimumSellingPrice: [null],
    mrp: [null],
    standardCost: [null],
    taxPercent: [18],
    reorderLevel: [0],
    shelfLifeDays: [null],
    weight: [null],
    dimensions: [''],
    isBatchTracked: [true],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadUnits();
  }

  loadProducts(event?: any): void {
    this.loading.set(true);
    const pageRequest = {
      page: event?.first ? event.first / event.rows : 0,
      size: event?.rows || 10,
      sort: event?.sortField || 'name',
      direction: (event?.sortOrder === 1 ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const request = this.searchTerm
      ? this.productService.search(this.searchTerm, pageRequest)
      : this.productService.getAll(pageRequest);

    request.subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products.set(response.data.content);
          this.totalRecords.set(response.data.totalElements);
        }
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
        this.loading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getByType('FINISHED_GOODS').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories.set(response.data);
        }
      },
    });
  }

  loadUnits(): void {
    this.unitService.getAllActive().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.units.set(response.data);
        }
      },
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  showDialog(): void {
    this.editMode = false;
    this.selectedProduct = null;
    this.productForm.reset({ taxPercent: 18, isBatchTracked: true });
    this.dialogVisible = true;
  }

  editProduct(product: FinishedGoods): void {
    this.editMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue(product);
    this.dialogVisible = true;
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    this.saving.set(true);
    const request: FinishedGoodsRequest = this.productForm.value;

    const operation =
      this.editMode && this.selectedProduct
        ? this.productService.update(this.selectedProduct.id, request)
        : this.productService.create(request);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${this.editMode ? 'updated' : 'created'} successfully`,
          });
          this.dialogVisible = false;
          this.loadProducts();
        }
        this.saving.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to save product',
        });
        this.saving.set(false);
      },
    });
  }

  confirmDelete(product: FinishedGoods): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete product "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProduct(product),
    });
  }

  deleteProduct(product: FinishedGoods): void {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
      },
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }
}
