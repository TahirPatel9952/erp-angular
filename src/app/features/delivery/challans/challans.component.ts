import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-challans',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './challans.component.html',
  styleUrl: './challans.component.scss',
})
export class ChallansComponent implements OnInit {
  challans = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadChallans();
  }

  loadChallans(): void {
    this.challans.set([
      { id: 1, challanNo: 'DC-2024-001', date: '2024-01-15', customer: 'ABC Industries', salesOrder: 'SO-2024-001', itemCount: 5, status: 'Delivered' },
      { id: 2, challanNo: 'DC-2024-002', date: '2024-01-16', customer: 'XYZ Corp', salesOrder: 'SO-2024-002', itemCount: 3, status: 'In Transit' },
      { id: 3, challanNo: 'DC-2024-003', date: '2024-01-17', customer: 'Tech Solutions', salesOrder: 'SO-2024-003', itemCount: 8, status: 'Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
