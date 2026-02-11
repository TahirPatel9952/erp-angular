export interface FinishedGoodsStock {
  id: number;
  finishedGoodsId: number;
  finishedGoodsCode?: string;
  finishedGoodsName?: string;
  warehouseId: number;
  warehouseName?: string;
  locationId?: number;
  locationName?: string;
  quantity: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  batchNo?: string;
  lotNo?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  unitCost?: number;
  totalValue?: number;
  createdAt?: string;
  updatedAt?: string;
}
