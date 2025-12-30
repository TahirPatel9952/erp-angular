import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, InputSwitchModule, DropdownModule],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
})
export class SystemComponent implements OnInit {
  settings = signal<any>({});

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settings.set({
      companyName: 'Manufacturing ERP Pvt Ltd',
      phone: '+91 9876543210',
      email: 'info@company.com',
      gstin: '27AABCU9603R1ZM',
      pan: 'AABCU9603R',
      address: 'Plot No. 123, Industrial Area, Mumbai - 400001',
      invoicePrefix: 'INV-',
      nextInvoiceNo: 1001,
      defaultTaxRate: 18,
      paymentTerms: 30,
      lowStockAlerts: true,
      negativeStock: false,
      defaultReorderLevel: 50,
      emailNotifications: true,
      orderConfirmations: true,
      paymentReminders: true
    });
  }
}
