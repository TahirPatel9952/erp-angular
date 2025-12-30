export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName?: string;
  supplierCode?: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  warehouseId?: number;
  warehouseName?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: PurchaseOrderStatus;
  paymentStatus: PurchasePaymentStatus;
  paymentTerms?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  items?: PurchaseOrderItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  approvedBy?: number;
  approvedAt?: string;
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  rawMaterialId: number;
  rawMaterialName?: string;
  rawMaterialCode?: string;
  quantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  unitId: number;
  unitName?: string;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface PurchaseOrderRequest {
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  warehouseId?: number;
  discountAmount?: number;
  shippingCost?: number;
  paymentTerms?: string;
  shippingMethod?: string;
  notes?: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemRequest {
  rawMaterialId: number;
  quantity: number;
  unitId: number;
  unitPrice: number;
  taxPercent?: number;
  discountPercent?: number;
  notes?: string;
}

export type PurchaseOrderStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED' | 'CLOSED';
export type PurchasePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

