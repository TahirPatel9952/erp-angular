export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string;
  customerCode?: string;
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
  status: SalesOrderStatus;
  paymentStatus: SalesPaymentStatus;
  paymentTerms?: string;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  notes?: string;
  items?: SalesOrderItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  approvedBy?: number;
  approvedAt?: string;
}

export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  quantity: number;
  deliveredQuantity: number;
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

export interface SalesOrderRequest {
  customerId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  warehouseId?: number;
  discountAmount?: number;
  shippingCost?: number;
  paymentTerms?: string;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  notes?: string;
  items: SalesOrderItemRequest[];
}

export interface SalesOrderItemRequest {
  finishedGoodsId: number;
  quantity: number;
  unitId: number;
  unitPrice: number;
  taxPercent?: number;
  discountPercent?: number;
  notes?: string;
}

export type SalesOrderStatus = 'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'READY_TO_SHIP' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type SalesPaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'REFUNDED';

