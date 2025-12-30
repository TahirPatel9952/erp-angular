export interface FinishedGoods {
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
  sellingPrice: number;
  minimumSellingPrice?: number;
  mrp?: number;
  standardCost?: number;
  reorderLevel?: number;
  taxPercent?: number;
  shelfLifeDays?: number;
  weight?: number;
  weightUnitId?: number;
  weightUnitSymbol?: string;
  dimensions?: string;
  barcode?: string;
  imageUrl?: string;
  isBatchTracked?: boolean;
  isActive: boolean;
  currentStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinishedGoodsRequest {
  name: string;
  code: string;
  description?: string;
  categoryId?: number;
  unitId: number;
  hsnCode?: string;
  sellingPrice: number;
  minimumSellingPrice?: number;
  mrp?: number;
  standardCost?: number;
  reorderLevel?: number;
  taxPercent?: number;
  shelfLifeDays?: number;
  weight?: number;
  weightUnitId?: number;
  dimensions?: string;
  barcode?: string;
  imageUrl?: string;
  isBatchTracked?: boolean;
  isActive?: boolean;
}

