export interface ProductionTracking {
  id: number;
  workOrderId: number;
  workOrderNumber?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  operationId?: number;
  operationName?: string;
  machineId?: number;
  machineName?: string;
  operatorId: number;
  operatorName?: string;
  shiftId?: number;
  shiftName?: string;
  stage: ProductionStage;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  targetQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  status: TrackingStatus;
  qualityStatus?: QualityCheckStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductionTrackingRequest {
  workOrderId: number;
  operationId?: number;
  machineId?: number;
  operatorId: number;
  shiftId?: number;
  stage: ProductionStage;
  startTime: string;
  targetQuantity: number;
  notes?: string;
}

export interface ProductionTrackingUpdate {
  endTime?: string;
  completedQuantity?: number;
  rejectedQuantity?: number;
  status?: TrackingStatus;
  qualityStatus?: QualityCheckStatus;
  notes?: string;
}

export interface InProcessInventory {
  id: number;
  workOrderId: number;
  workOrderNumber?: string;
  finishedGoodsId: number;
  finishedGoodsName?: string;
  finishedGoodsCode?: string;
  currentStage: ProductionStage;
  quantity: number;
  unitId: number;
  unitName?: string;
  startDate: string;
  expectedEndDate?: string;
  operatorId?: number;
  operatorName?: string;
  status: InProcessStatus;
  notes?: string;
}

export type ProductionStage = 'RAW_MATERIAL_ISSUE' | 'CUTTING' | 'MACHINING' | 'ASSEMBLY' | 'FINISHING' | 'QUALITY_CHECK' | 'PACKAGING' | 'COMPLETED';
export type TrackingStatus = 'STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type QualityCheckStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'REWORK';
export type InProcessStatus = 'IN_PROGRESS' | 'ON_HOLD' | 'PENDING_QC' | 'QC_PASSED' | 'QC_FAILED' | 'COMPLETED';

