import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, InputTextModule],
  template: `
    <div class="forgot-container">
      <div class="forgot-card">
        <div class="forgot-header">
          <i class="pi pi-lock"></i>
          <h1>Forgot Password?</h1>
          <p>Enter your email to reset your password</p>
        </div>
        
        <div class="form-field">
          <label>Email</label>
          <input pInputText placeholder="Enter your email" class="w-full" />
        </div>
        
        <button pButton label="Send Reset Link" class="w-full"></button>
        
        <div class="forgot-footer">
          <a routerLink="/auth/login">
            <i class="pi pi-arrow-left"></i>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1565c0 100%);
      padding: 1rem;
    }

    .forgot-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .forgot-header {
      margin-bottom: 2rem;

      i {
        font-size: 3rem;
        color: var(--primary-color);
      }

      h1 {
        font-size: 1.5rem;
        margin: 1rem 0 0.5rem;
      }

      p {
        color: var(--text-secondary);
      }
    }

    .form-field {
      margin-bottom: 1.5rem;
      text-align: left;

      label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }
    }

    .forgot-footer {
      margin-top: 1.5rem;

      a {
        color: var(--primary-color);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  `],
})
export class ForgotPasswordComponent {}

