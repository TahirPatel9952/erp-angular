import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  payments = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.payments.set([
      { id: 1, paymentId: 'PAY-001', date: '2024-01-15', invoice: 'INV-2024-001', customer: 'ABC Industries', amount: 59000, method: 'Bank Transfer', status: 'Completed' },
      { id: 2, paymentId: 'PAY-002', date: '2024-01-16', invoice: 'INV-2024-002', customer: 'XYZ Corp', amount: 50000, method: 'Cheque', status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
