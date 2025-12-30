export interface Category {
  id: number;
  name: string;
  code: string;
  type: CategoryType;
  parentId?: number;
  parentName?: string;
  description?: string;
  isActive: boolean;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  code?: string;
  type: CategoryType;
  parentId?: number;
  description?: string;
  isActive?: boolean;
}

export type CategoryType = 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'SEMI_FINISHED' | 'CONSUMABLE' | 'PACKAGING';

