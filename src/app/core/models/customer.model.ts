export interface Customer {
  id: number;
  name: string;
  code: string;
  customerType?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPincode?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPincode?: string;
  gstNo?: string;
  panNo?: string;
  creditLimit?: number;
  currentBalance?: number;
  availableCredit?: number;
  paymentTerms?: number;
  discountPercent?: number;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerRequest {
  name: string;
  code: string;
  customerType?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPincode?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPincode?: string;
  gstNo?: string;
  panNo?: string;
  creditLimit?: number;
  paymentTerms?: number;
  discountPercent?: number;
  notes?: string;
  isActive?: boolean;
}

