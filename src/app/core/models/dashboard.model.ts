export interface DashboardStats {
  totalSales: number;
  salesGrowthPercent: number;
  pendingOrders: number;
  newOrdersToday: number;
  productionCount: number;
  productionEfficiencyPercent: number;
  lowStockItems: number;
  criticalStockItems: number;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
  trendUp: boolean;
  color: string;
}

export interface SalesChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ProductionChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
  tension?: number;
}

export interface PendingOrder {
  id: number;
  orderNo: string;
  customer: string;
  amount: number;
  formattedAmount: string;
  status: string;
  orderDate: string;
}

export interface LowStockItem {
  id: number;
  name: string;
  code: string;
  currentStock: number;
  reorderLevel: number;
  unitName: string;
  isCritical: boolean;
}

export interface RecentActivity {
  id: number;
  type: ActivityType;
  description: string;
  user: string;
  time: string;
  relativeTime: string;
}

export type ActivityType = 'sale' | 'production' | 'purchase' | 'inventory' | 'delivery' | 'payment';

export interface DashboardSummary {
  stats: DashboardStats;
  salesChart: SalesChartData;
  productionChart: ProductionChartData;
  pendingOrders: PendingOrder[];
  lowStockItems: LowStockItem[];
  recentActivities: RecentActivity[];
}

