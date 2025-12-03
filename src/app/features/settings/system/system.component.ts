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
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>System Settings</h1>
        <div class="header-actions">
          <button pButton label="Save Changes" icon="pi pi-save"></button>
        </div>
      </div>

      <div class="settings-grid">
        <p-card header="Company Information" styleClass="settings-card">
          <div class="form-grid">
            <div class="form-field full-width">
              <label>Company Name</label>
              <input pInputText class="w-full" [(ngModel)]="settings().companyName" />
            </div>
            <div class="form-field">
              <label>Phone</label>
              <input pInputText class="w-full" [(ngModel)]="settings().phone" />
            </div>
            <div class="form-field">
              <label>Email</label>
              <input pInputText class="w-full" [(ngModel)]="settings().email" />
            </div>
            <div class="form-field">
              <label>GSTIN</label>
              <input pInputText class="w-full" [(ngModel)]="settings().gstin" />
            </div>
            <div class="form-field">
              <label>PAN</label>
              <input pInputText class="w-full" [(ngModel)]="settings().pan" />
            </div>
            <div class="form-field full-width">
              <label>Address</label>
              <input pInputText class="w-full" [(ngModel)]="settings().address" />
            </div>
          </div>
        </p-card>

        <p-card header="Invoice Settings" styleClass="settings-card">
          <div class="form-grid">
            <div class="form-field">
              <label>Invoice Prefix</label>
              <input pInputText class="w-full" [(ngModel)]="settings().invoicePrefix" />
            </div>
            <div class="form-field">
              <label>Next Invoice No</label>
              <input pInputText type="number" class="w-full" [(ngModel)]="settings().nextInvoiceNo" />
            </div>
            <div class="form-field">
              <label>Default Tax Rate (%)</label>
              <input pInputText type="number" class="w-full" [(ngModel)]="settings().defaultTaxRate" />
            </div>
            <div class="form-field">
              <label>Payment Terms (Days)</label>
              <input pInputText type="number" class="w-full" [(ngModel)]="settings().paymentTerms" />
            </div>
          </div>
        </p-card>

        <p-card header="Inventory Settings" styleClass="settings-card">
          <div class="form-grid">
            <div class="form-field full-width setting-row">
              <label>Enable Low Stock Alerts</label>
              <p-inputSwitch [(ngModel)]="settings().lowStockAlerts"></p-inputSwitch>
            </div>
            <div class="form-field full-width setting-row">
              <label>Enable Negative Stock</label>
              <p-inputSwitch [(ngModel)]="settings().negativeStock"></p-inputSwitch>
            </div>
            <div class="form-field">
              <label>Default Reorder Level</label>
              <input pInputText type="number" class="w-full" [(ngModel)]="settings().defaultReorderLevel" />
            </div>
          </div>
        </p-card>

        <p-card header="Notification Settings" styleClass="settings-card">
          <div class="form-grid">
            <div class="form-field full-width setting-row">
              <label>Email Notifications</label>
              <p-inputSwitch [(ngModel)]="settings().emailNotifications"></p-inputSwitch>
            </div>
            <div class="form-field full-width setting-row">
              <label>Order Confirmations</label>
              <p-inputSwitch [(ngModel)]="settings().orderConfirmations"></p-inputSwitch>
            </div>
            <div class="form-field full-width setting-row">
              <label>Payment Reminders</label>
              <p-inputSwitch [(ngModel)]="settings().paymentReminders"></p-inputSwitch>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1rem;
    }
    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `],
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

