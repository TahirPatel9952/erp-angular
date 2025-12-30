export interface BOM {
  id: number;
  code: string;
  name: string;
  description?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  version: string;
  quantity: number;
  unitId: number;
  unitName?: string;
  unitCost?: number;
  laborCost?: number;
  overheadCost?: number;
  totalCost?: number;
  status: BOMStatus;
  effectiveDate?: string;
  expiryDate?: string;
  notes?: string;
  isActive: boolean;
  items?: BOMItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface BOMItem {
  id: number;
  bomId: number;
  rawMaterialId: number;
  rawMaterialName?: string;
  rawMaterialCode?: string;
  quantity: number;
  unitId: number;
  unitName?: string;
  unitCost?: number;
  totalCost?: number;
  wastagePercent?: number;
  notes?: string;
  sequence: number;
}

export interface BOMRequest {
  code: string;
  name: string;
  description?: string;
  finishedGoodsId: number;
  version?: string;
  quantity: number;
  unitId: number;
  laborCost?: number;
  overheadCost?: number;
  status?: BOMStatus;
  effectiveDate?: string;
  expiryDate?: string;
  notes?: string;
  items?: BOMItemRequest[];
}

export interface BOMItemRequest {
  rawMaterialId: number;
  quantity: number;
  unitId: number;
  wastagePercent?: number;
  notes?: string;
  sequence?: number;
}

export type BOMStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';

