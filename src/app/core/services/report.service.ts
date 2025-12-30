import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse } from '../models/api-response.model';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  warehouseId?: number;
  categoryId?: number;
  supplierId?: number;
  customerId?: number;
}

export interface InventoryReportData {
  stockSummary: {
    totalItems: number;
    totalValue: number;
    lowStock: number;
  };
  movementSummary: {
    received: number;
    issued: number;
    adjustments: number;
  };
  agingData: any[];
}

export interface SalesReportData {
  salesSummary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  collectionSummary: {
    invoiced: number;
    collected: number;
    outstanding: number;
  };
  topCustomers: any[];
}

export interface PurchaseReportData {
  purchaseSummary: {
    totalPOs: number;
    totalValue: number;
    pending: number;
  };
  paymentSummary: {
    payable: number;
    paid: number;
    outstanding: number;
  };
  topSuppliers: any[];
}

export interface GSTReportData {
  outputGST: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  inputGST: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  netGST: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  hsnSummary: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1/reports`;

  // Inventory Reports
  getInventoryReport(filter?: ReportFilter): Observable<ApiResponse<InventoryReportData>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<InventoryReportData>>(`${this.apiUrl}/inventory`, { params });
  }

  getStockValuationReport(warehouseId?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (warehouseId) {
      params = params.set('warehouseId', warehouseId.toString());
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/inventory/valuation`, { params });
  }

  getStockAgingReport(filter?: ReportFilter): Observable<ApiResponse<any>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/inventory/aging`, { params });
  }

  // Sales Reports
  getSalesReport(filter?: ReportFilter): Observable<ApiResponse<SalesReportData>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<SalesReportData>>(`${this.apiUrl}/sales`, { params });
  }

  getCustomerLedger(customerId: number, filter?: ReportFilter): Observable<ApiResponse<any>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/sales/customer-ledger/${customerId}`, { params });
  }

  getTopCustomersReport(limit?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/sales/top-customers`, { params });
  }

  // Purchase Reports
  getPurchaseReport(filter?: ReportFilter): Observable<ApiResponse<PurchaseReportData>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<PurchaseReportData>>(`${this.apiUrl}/purchase`, { params });
  }

  getSupplierLedger(supplierId: number, filter?: ReportFilter): Observable<ApiResponse<any>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/purchase/supplier-ledger/${supplierId}`, { params });
  }

  getTopSuppliersReport(limit?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/purchase/top-suppliers`, { params });
  }

  // GST Reports
  getGSTReport(filter?: ReportFilter): Observable<ApiResponse<GSTReportData>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<GSTReportData>>(`${this.apiUrl}/gst`, { params });
  }

  getGSTR1Report(month: number, year: number): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/gst/gstr1`, { params });
  }

  getGSTR3BReport(month: number, year: number): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/gst/gstr3b`, { params });
  }

  getHSNSummary(filter?: ReportFilter): Observable<ApiResponse<any>> {
    const params = this.buildParams(filter);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/gst/hsn-summary`, { params });
  }

  // Export Reports
  exportInventoryReport(filter?: ReportFilter, format: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    const params = this.buildParams(filter).set('format', format);
    return this.http.get(`${this.apiUrl}/inventory/export`, { params, responseType: 'blob' });
  }

  exportSalesReport(filter?: ReportFilter, format: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    const params = this.buildParams(filter).set('format', format);
    return this.http.get(`${this.apiUrl}/sales/export`, { params, responseType: 'blob' });
  }

  exportPurchaseReport(filter?: ReportFilter, format: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    const params = this.buildParams(filter).set('format', format);
    return this.http.get(`${this.apiUrl}/purchase/export`, { params, responseType: 'blob' });
  }

  exportGSTReport(filter?: ReportFilter, format: 'excel' | 'pdf' = 'excel'): Observable<Blob> {
    const params = this.buildParams(filter).set('format', format);
    return this.http.get(`${this.apiUrl}/gst/export`, { params, responseType: 'blob' });
  }

  private buildParams(filter?: ReportFilter): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate);
      if (filter.endDate) params = params.set('endDate', filter.endDate);
      if (filter.warehouseId) params = params.set('warehouseId', filter.warehouseId.toString());
      if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
      if (filter.supplierId) params = params.set('supplierId', filter.supplierId.toString());
      if (filter.customerId) params = params.set('customerId', filter.customerId.toString());
    }
    return params;
  }
}

