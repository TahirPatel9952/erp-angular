export interface WorkOrder {
  id: number;
  orderNumber: string;
  bomId: number;
  bomCode?: string;
  bomName?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  salesOrderId?: number;
  salesOrderNumber?: string;
  quantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  unitId: number;
  unitName?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  sourceWarehouseId?: number;
  sourceWarehouseName?: string;
  targetWarehouseId?: number;
  targetWarehouseName?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  progress: number;
  notes?: string;
  assignedTo?: number;
  assignedToName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface WorkOrderRequest {
  bomId: number;
  salesOrderId?: number;
  quantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
  sourceWarehouseId?: number;
  targetWarehouseId?: number;
  priority?: WorkOrderPriority;
  notes?: string;
  assignedTo?: number;
}

export interface WorkOrderUpdateRequest {
  quantity?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  sourceWarehouseId?: number;
  targetWarehouseId?: number;
  priority?: WorkOrderPriority;
  status?: WorkOrderStatus;
  notes?: string;
  assignedTo?: number;
}

export interface WorkOrderProgressUpdate {
  completedQuantity: number;
  rejectedQuantity?: number;
  notes?: string;
}

export type WorkOrderStatus = 'DRAFT' | 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

