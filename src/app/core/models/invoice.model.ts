export interface Invoice {
  id: number;
  invoiceNumber: string;
  salesOrderId?: number;
  salesOrderNumber?: string;
  deliveryChallanId?: number;
  deliveryChallanNumber?: string;
  customerId: number;
  customerName?: string;
  customerCode?: string;
  customerGstin?: string;
  invoiceDate: string;
  dueDate: string;
  billingAddress: string;
  shippingAddress?: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  discountAmount: number;
  roundOff: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  paymentStatus: InvoicePaymentStatus;
  paymentTerms?: string;
  bankDetails?: string;
  termsAndConditions?: string;
  notes?: string;
  items?: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  hsnCode?: string;
  description?: string;
  quantity: number;
  unitId: number;
  unitName?: string;
  unitPrice: number;
  taxableAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
}

export interface InvoiceRequest {
  salesOrderId?: number;
  deliveryChallanId?: number;
  customerId: number;
  invoiceDate: string;
  dueDate: string;
  billingAddress: string;
  shippingAddress?: string;
  discountAmount?: number;
  paymentTerms?: string;
  bankDetails?: string;
  termsAndConditions?: string;
  notes?: string;
  items: InvoiceItemRequest[];
}

export interface InvoiceItemRequest {
  finishedGoodsId: number;
  description?: string;
  quantity: number;
  unitId: number;
  unitPrice: number;
  cgstPercent?: number;
  sgstPercent?: number;
  igstPercent?: number;
  discountPercent?: number;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'SENT' | 'VIEWED' | 'CANCELLED' | 'VOID';
export type InvoicePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'REFUNDED' | 'WRITTEN_OFF';

