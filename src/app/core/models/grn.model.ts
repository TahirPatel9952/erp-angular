export interface GRN {
  id: number;
  grnNumber: string;
  purchaseOrderId: number;
  purchaseOrderNumber?: string;
  supplierId: number;
  supplierName?: string;
  warehouseId: number;
  warehouseName?: string;
  receiptDate: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  vehicleNo?: string;
  vehicleNumber?: string; // Alias
  driverName?: string;
  challanNo?: string;
  challanNumber?: string; // Alias
  challanDate?: string;
  status: GRNStatus;
  totalItems: number;
  totalQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  totalAmount: number;
  notes?: string;
  items?: GRNItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  verifiedBy?: number;
  verifiedAt?: string;
}

export interface GRNItem {
  id: number;
  grnId: number;
  purchaseOrderItemId?: number;
  rawMaterialId: number;
  rawMaterialName?: string;
  rawMaterialCode?: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitId: number;
  unitName?: string;
  unitPrice: number;
  totalAmount: number;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  qualityStatus: QualityStatus;
  rejectionReason?: string;
  notes?: string;
}

export interface GRNRequest {
  purchaseOrderId?: number;
  supplierId: number;
  warehouseId: number;
  receiptDate: string;
  vehicleNo?: string;
  driverName?: string;
  challanNo?: string;
  challanDate?: string;
  notes?: string;
  items: GRNItemRequest[];
}

export interface GRNItemRequest {
  purchaseOrderItemId?: number;
  rawMaterialId: number;
  orderedQuantity?: number;
  receivedQuantity: number;
  acceptedQuantity?: number;
  rejectedQuantity?: number;
  unitId: number;
  unitPrice?: number;
  batchNumber?: string;
  lotNo?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  qcStatus?: string;
  rejectionReason?: string;
  notes?: string;
}

export type GRNStatus = 'DRAFT' | 'PENDING_QC' | 'QC_IN_PROGRESS' | 'QC_COMPLETED' | 'VERIFIED' | 'CANCELLED';
export type QualityStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'CONDITIONAL';

