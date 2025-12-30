export interface DeliveryChallan {
  id: number;
  challanNumber: string;
  salesOrderId: number;
  salesOrderNumber?: string;
  customerId: number;
  customerName?: string;
  warehouseId: number;
  warehouseName?: string;
  challanDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  transporterName?: string;
  lrNumber?: string;
  ewayBillNumber?: string;
  status: DeliveryChallanStatus;
  totalItems: number;
  totalQuantity: number;
  totalWeight?: number;
  notes?: string;
  items?: DeliveryChallanItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  dispatchedBy?: number;
  dispatchedAt?: string;
}

export interface DeliveryChallanItem {
  id: number;
  deliveryChallanId: number;
  salesOrderItemId?: number;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  orderedQuantity: number;
  dispatchedQuantity: number;
  previouslyDispatchedQuantity: number;
  unitId: number;
  unitName?: string;
  batchNumber?: string;
  serialNumbers?: string;
  notes?: string;
}

export interface DeliveryChallanRequest {
  salesOrderId: number;
  warehouseId: number;
  challanDate: string;
  deliveryAddress: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  transporterName?: string;
  lrNumber?: string;
  ewayBillNumber?: string;
  notes?: string;
  items: DeliveryChallanItemRequest[];
}

export interface DeliveryChallanItemRequest {
  salesOrderItemId?: number;
  finishedGoodsId: number;
  dispatchedQuantity: number;
  unitId: number;
  batchNumber?: string;
  serialNumbers?: string;
  notes?: string;
}

export type DeliveryChallanStatus = 'DRAFT' | 'READY_TO_DISPATCH' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'PARTIALLY_DELIVERED' | 'CANCELLED' | 'RETURNED';

