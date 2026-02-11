export interface BOM {
  id: number;
  code: string;
  description?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  version: string;
  outputQuantity?: number;
  outputUnitId?: number;
  outputUnitName?: string;
  outputUnitSymbol?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  standardTimeMinutes?: number;
  setupTimeMinutes?: number;
  isActive: boolean;
  status?: string;
  totalMaterialCost?: number;
  laborCost?: number;
  overheadCost?: number;
  totalCost?: number;
  items?: BOMItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface BOMItem {
  id: number;
  itemType: string; // RAW_MATERIAL, IN_PROCESS, SUB_ASSEMBLY
  itemId: number;
  itemCode?: string;
  itemName?: string;
  sequenceNo?: number;
  quantity: number;
  quantityWithWastage?: number;
  unitId: number;
  unitName?: string;
  unitSymbol?: string;
  wastagePercent?: number;
  isCritical?: boolean;
  notes?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface BOMRequest {
  code: string;
  finishedGoodsId: number;
  version?: string;
  description?: string;
  outputQuantity?: number;
  outputUnitId?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  standardTimeMinutes?: number;
  setupTimeMinutes?: number;
  isActive?: boolean;
  items?: BOMItemRequest[];
}

export interface BOMItemRequest {
  itemType: string; // RAW_MATERIAL, IN_PROCESS, SUB_ASSEMBLY
  itemId: number;
  sequenceNo?: number;
  quantity: number;
  unitId: number;
  wastagePercent?: number;
  isCritical?: boolean;
  notes?: string;
}

export type BOMStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';

