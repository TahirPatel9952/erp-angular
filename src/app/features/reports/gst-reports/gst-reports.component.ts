import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-gst-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule, DropdownModule],
  templateUrl: './gst-reports.component.html',
  styleUrl: './gst-reports.component.scss',
})
export class GstReportsComponent implements OnInit {
  gstSummary = signal({
    outputCGST: 0, outputSGST: 0, outputIGST: 0,
    inputCGST: 0, inputSGST: 0, inputIGST: 0,
    netCGST: 0, netSGST: 0, netIGST: 0
  });
  hsnData = signal<any[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.gstSummary.set({
      outputCGST: 425000, outputSGST: 425000, outputIGST: 150000,
      inputCGST: 160000, inputSGST: 160000, inputIGST: 80000,
      netCGST: 265000, netSGST: 265000, netIGST: 70000
    });
    this.hsnData.set([
      { hsnCode: '8501', description: 'Electric Motors', taxableValue: 2500000, cgst: 225000, sgst: 225000, igst: 0, totalTax: 450000 },
      { hsnCode: '8483', description: 'Gear Boxes', taxableValue: 1500000, cgst: 135000, sgst: 135000, igst: 0, totalTax: 270000 },
      { hsnCode: '8482', description: 'Bearings', taxableValue: 500000, cgst: 45000, sgst: 45000, igst: 0, totalTax: 90000 },
    ]);
  }
}
