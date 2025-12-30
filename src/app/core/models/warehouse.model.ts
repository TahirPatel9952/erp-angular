export interface Warehouse {
  id: number;
  name: string;
  code: string;
  type: WarehouseType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  locations?: WarehouseLocation[];
  createdAt?: string;
  updatedAt?: string;
}

export type WarehouseType = 'MAIN' | 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'WIP' | 'TRANSIT' | 'SCRAP';

export interface WarehouseLocation {
  id: number;
  locationCode: string;
  zone?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  isActive: boolean;
}

export interface WarehouseRequest {
  name: string;
  code: string;
  type: WarehouseType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
}

