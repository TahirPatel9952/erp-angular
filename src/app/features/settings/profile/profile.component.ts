import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, AvatarModule, DividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile = signal<any>({});

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profile.set({
      name: 'Admin User',
      email: 'admin@company.com',
      phone: '+91 9876543210',
      role: 'Administrator',
      department: 'IT',
      joinDate: 'January 2023'
    });
  }
}
