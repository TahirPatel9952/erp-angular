export interface Stock {
  id: number;
  itemType: StockItemType;
  itemId: number;
  itemName?: string;
  itemCode?: string;
  warehouseId: number;
  warehouseName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitId: number;
  unitName?: string;
  batchNumber?: string;
  serialNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  locationCode?: string;
  lastUpdated?: string;
}

export interface StockAdjustment {
  id: number;
  adjustmentNumber: string;
  itemType: StockItemType;
  itemId: number;
  itemName?: string;
  itemCode?: string;
  warehouseId: number;
  warehouseName?: string;
  adjustmentType: AdjustmentType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitId: number;
  unitName?: string;
  reason: AdjustmentReason;
  referenceNumber?: string;
  notes?: string;
  status: AdjustmentStatus;
  adjustmentDate: string;
  createdAt?: string;
  createdBy?: number;
  createdByName?: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
}

export interface StockAdjustmentRequest {
  itemType: StockItemType;
  itemId: number;
  warehouseId: number;
  adjustmentType: AdjustmentType;
  quantity: number;
  reason: AdjustmentReason;
  referenceNumber?: string;
  notes?: string;
  adjustmentDate: string;
}

export interface StockTransfer {
  id: number;
  transferNumber: string;
  itemType: StockItemType;
  itemId: number;
  itemName?: string;
  itemCode?: string;
  sourceWarehouseId: number;
  sourceWarehouseName?: string;
  targetWarehouseId: number;
  targetWarehouseName?: string;
  quantity: number;
  unitId: number;
  unitName?: string;
  status: TransferStatus;
  transferDate: string;
  notes?: string;
  createdAt?: string;
  createdBy?: number;
}

export interface StockTransferRequest {
  itemType: StockItemType;
  itemId: number;
  sourceWarehouseId: number;
  targetWarehouseId: number;
  quantity: number;
  transferDate: string;
  notes?: string;
}

export type StockItemType = 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'SEMI_FINISHED' | 'CONSUMABLE';
export type AdjustmentType = 'ADDITION' | 'DEDUCTION';
export type AdjustmentReason = 'STOCK_COUNT' | 'DAMAGED' | 'EXPIRED' | 'THEFT' | 'RETURNED' | 'CORRECTION' | 'OTHER';
export type AdjustmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type TransferStatus = 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

