export interface PurchaseOrder {
  id: number;
  orderNumber?: string;
  poNumber?: string; // Backend uses poNumber
  supplierId: number;
  supplierName?: string;
  supplierCode?: string;
  orderDate: string;
  expectedDate?: string; // Backend uses expectedDate
  expectedDeliveryDate?: string; // Alias for expectedDate
  actualDeliveryDate?: string;
  warehouseId?: number;
  warehouseName?: string;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  discountPercent?: number;
  shippingCharges?: number;
  shippingCost?: number; // Alias
  grandTotal?: number;
  totalAmount?: number; // Alias
  paidAmount?: number;
  balanceAmount?: number;
  status: PurchaseOrderStatus;
  paymentStatus?: PurchasePaymentStatus;
  paymentTerms?: string;
  deliveryTerms?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  items?: PurchaseOrderItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  approvedBy?: number;
  approvedByName?: string;
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
  warehouseId: number;
  orderDate?: string;
  expectedDate?: string; // Backend uses expectedDate
  expectedDeliveryDate?: string; // Alias
  discountPercent?: number;
  shippingCharges?: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  notes?: string;
  internalNotes?: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemRequest {
  id?: number; // For updates
  rawMaterialId: number;
  quantity: number;
  unitId?: number; // Optional, can be derived from raw material
  unitPrice: number;
  taxPercent?: number;
  discountPercent?: number;
  notes?: string;
}

export type PurchaseOrderStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED' | 'CLOSED';
export type PurchasePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

