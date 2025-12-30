export interface Payment {
  id: number;
  paymentNumber: string;
  invoiceId?: number;
  invoiceNumber?: string;
  customerId?: number;
  customerName?: string;
  supplierId?: number;
  supplierName?: string;
  paymentType: PaymentType;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  bankName?: string;
  chequeNumber?: string;
  chequeDate?: string;
  transactionId?: string;
  status: PaymentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  approvedBy?: number;
  approvedAt?: string;
}

export interface PaymentRequest {
  invoiceId?: number;
  customerId?: number;
  supplierId?: number;
  paymentType: PaymentType;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  bankName?: string;
  chequeNumber?: string;
  chequeDate?: string;
  transactionId?: string;
  notes?: string;
}

export type PaymentType = 'RECEIVED' | 'MADE' | 'REFUND' | 'ADVANCE';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'UPI' | 'CARD' | 'NEFT' | 'RTGS' | 'IMPS' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

