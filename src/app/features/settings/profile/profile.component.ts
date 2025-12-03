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
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Profile</h1>
      </div>

      <div class="profile-grid">
        <p-card styleClass="profile-card">
          <div class="profile-header">
            <p-avatar [label]="profile().name.charAt(0)" size="xlarge" shape="circle" styleClass="profile-avatar"></p-avatar>
            <div class="profile-info">
              <h2>{{ profile().name }}</h2>
              <p>{{ profile().role }}</p>
            </div>
          </div>
          <p-divider></p-divider>
          <div class="profile-details">
            <div class="detail-item">
              <i class="pi pi-envelope"></i>
              <span>{{ profile().email }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-phone"></i>
              <span>{{ profile().phone }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-building"></i>
              <span>{{ profile().department }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-calendar"></i>
              <span>Joined {{ profile().joinDate }}</span>
            </div>
          </div>
        </p-card>

        <div class="profile-forms">
          <p-card header="Update Profile" styleClass="settings-card">
            <div class="form-grid">
              <div class="form-field">
                <label>Full Name</label>
                <input pInputText class="w-full" [(ngModel)]="profile().name" />
              </div>
              <div class="form-field">
                <label>Email</label>
                <input pInputText class="w-full" [(ngModel)]="profile().email" />
              </div>
              <div class="form-field">
                <label>Phone</label>
                <input pInputText class="w-full" [(ngModel)]="profile().phone" />
              </div>
              <div class="form-field">
                <label>Department</label>
                <input pInputText class="w-full" [(ngModel)]="profile().department" disabled />
              </div>
            </div>
            <div class="mt-4">
              <button pButton label="Update Profile" icon="pi pi-check"></button>
            </div>
          </p-card>

          <p-card header="Change Password" styleClass="settings-card">
            <div class="form-grid">
              <div class="form-field full-width">
                <label>Current Password</label>
                <input pInputText type="password" class="w-full" />
              </div>
              <div class="form-field">
                <label>New Password</label>
                <input pInputText type="password" class="w-full" />
              </div>
              <div class="form-field">
                <label>Confirm New Password</label>
                <input pInputText type="password" class="w-full" />
              </div>
            </div>
            <div class="mt-4">
              <button pButton label="Change Password" icon="pi pi-lock"></button>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1.5rem;
    }
    .profile-header {
      text-align: center;
    }
    .profile-avatar {
      font-size: 2rem;
    }
    .profile-info h2 {
      margin: 1rem 0 0.25rem;
    }
    .profile-info p {
      color: var(--text-color-secondary);
      margin: 0;
    }
    .profile-details {
      margin-top: 1rem;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }
    .detail-item i {
      color: var(--primary-color);
    }
    .profile-forms {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
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

