import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse } from '../models/api-response.model';
import { 
  DashboardStats, 
  DashboardSummary, 
  PendingOrder, 
  LowStockItem, 
  RecentActivity,
  SalesChartData,
  ProductionChartData
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/dashboard`;

  getSummary(): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(this.apiUrl);
  }

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`);
  }

  getSalesChart(period?: string): Observable<ApiResponse<SalesChartData>> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<ApiResponse<SalesChartData>>(`${this.apiUrl}/sales-chart`, { params });
  }

  getProductionChart(): Observable<ApiResponse<ProductionChartData>> {
    return this.http.get<ApiResponse<ProductionChartData>>(`${this.apiUrl}/production-chart`);
  }

  getPendingOrders(limit?: number): Observable<ApiResponse<PendingOrder[]>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<ApiResponse<PendingOrder[]>>(`${this.apiUrl}/pending-orders`, { params });
  }

  getLowStockItems(limit?: number): Observable<ApiResponse<LowStockItem[]>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<ApiResponse<LowStockItem[]>>(`${this.apiUrl}/low-stock`, { params });
  }

  getRecentActivities(limit?: number): Observable<ApiResponse<RecentActivity[]>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<ApiResponse<RecentActivity[]>>(`${this.apiUrl}/recent-activities`, { params });
  }

  // Period options: 'week', 'month', 'quarter', 'year'
  getSalesReport(period: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reports/sales`, { params: { period } });
  }

  getInventoryReport(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reports/inventory`);
  }

  getProductionReport(period: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/reports/production`, { params: { period } });
  }
}

