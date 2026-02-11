export interface RawMaterial {
  id: number;
  name: string;
  code: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  category?: {
    id: number;
    name: string;
    code: string;
  };
  unitId?: number; // For backward compatibility
  unit?: {
    id: number;
    name: string;
    symbol: string;
  };
  unitName?: string; // For backward compatibility
  unitSymbol?: string; // For backward compatibility
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

