export interface RawMaterial {
  id: number;
  name: string;
  code: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  unitId: number;
  unitName?: string;
  unitSymbol?: string;
  hsnCode?: string;
  unitPrice: number;
  reorderLevel: number;
  reorderQuantity?: number;
  leadTimeDays?: number;
  taxPercent: number;
  supplierId?: number;
  supplierName?: string;
  barcode?: string;
  isActive: boolean;
  currentStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawMaterialRequest {
  name: string;
  code: string;
  description?: string;
  categoryId?: number;
  unitId: number;
  hsnCode?: string;
  unitPrice: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  leadTimeDays?: number;
  taxPercent?: number;
  supplierId?: number;
  barcode?: string;
  isActive?: boolean;
}

