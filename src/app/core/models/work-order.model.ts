export interface WorkOrder {
  id: number;
  orderNumber?: string; // Frontend field name
  workOrderNo?: string; // Backend field name
  bomId: number;
  bomCode?: string;
  bomName?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  salesOrderId?: number;
  salesOrderNumber?: string;
  quantity?: number; // Frontend field name
  plannedQuantity?: number; // Backend field name
  completedQuantity?: number;
  rejectedQuantity?: number;
  pendingQuantity?: number;
  completionPercentage?: number;
  unitId?: number;
  unitName?: string;
  unitSymbol?: string;
  plannedStartDate?: string; // Frontend field name
  scheduledStartDate?: string; // Backend field name
  plannedEndDate?: string; // Frontend field name
  scheduledEndDate?: string; // Backend field name
  actualStartDate?: string;
  actualEndDate?: string;
  sourceWarehouseId?: number;
  sourceWarehouseName?: string;
  targetWarehouseId?: number;
  targetWarehouseName?: string;
  warehouseId?: number; // Backend field name
  warehouseName?: string; // Backend field name
  priority?: WorkOrderPriority | string;
  status?: WorkOrderStatus | string;
  progress?: number;
  batchNo?: string;
  notes?: string;
  assignedTo?: number;
  assignedToName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface WorkOrderRequest {
  bomId: number;
  finishedGoodsId: number;
  salesOrderId?: number;
  quantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
  warehouseId: number; // Changed from sourceWarehouseId/targetWarehouseId
  priority?: WorkOrderPriority;
  batchNo?: string;
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

