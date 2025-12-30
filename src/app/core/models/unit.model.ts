export interface Unit {
  id: number;
  code: string;
  name: string;
  symbol: string;
  type: UnitType;
  baseUnitId?: number;
  baseUnitName?: string;
  baseUnitSymbol?: string;
  conversionFactor: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitRequest {
  code: string;
  name: string;
  symbol: string;
  type: UnitType;
  baseUnitId?: number;
  conversionFactor?: number;
  isActive?: boolean;
}

export type UnitType = 'WEIGHT' | 'LENGTH' | 'VOLUME' | 'QUANTITY' | 'AREA' | 'TIME';

