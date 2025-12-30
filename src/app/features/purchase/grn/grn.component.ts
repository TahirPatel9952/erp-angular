import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-grn',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule],
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss',
})
export class GrnComponent implements OnInit {
  grns = signal<any[]>([]);
  searchTerm = '';
  dialogVisible = false;

  ngOnInit(): void {
    this.loadGrns();
  }

  loadGrns(): void {
    this.grns.set([
      { id: 1, grnNumber: 'GRN-2024-001', date: '2024-01-20', poReference: 'PO-2024-001', supplier: 'Steel India Ltd', itemCount: 5, status: 'Verified' },
      { id: 2, grnNumber: 'GRN-2024-002', date: '2024-01-22', poReference: 'PO-2024-002', supplier: 'Plastic World', itemCount: 2, status: 'QC Pending' },
    ]);
  }

  showDialog(): void {
    this.dialogVisible = true;
  }
}
