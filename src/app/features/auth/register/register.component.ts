import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo">
            <i class="pi pi-building"></i>
          </div>
          <h1>Create Account</h1>
          <p>Register for Manufacturing ERP</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-field">
              <label for="firstName">First Name</label>
              <input pInputText id="firstName" formControlName="firstName" placeholder="First name" class="w-full" />
            </div>
            <div class="form-field">
              <label for="lastName">Last Name</label>
              <input pInputText id="lastName" formControlName="lastName" placeholder="Last name" class="w-full" />
            </div>
          </div>

          <div class="form-field">
            <label for="username">Username *</label>
            <input pInputText id="username" formControlName="username" placeholder="Enter username" class="w-full" />
            @if (registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['required']) {
              <small class="p-error">Username is required</small>
            }
          </div>

          <div class="form-field">
            <label for="email">Email *</label>
            <input pInputText id="email" formControlName="email" placeholder="Enter email" class="w-full" />
            @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']) {
              <small class="p-error">Email is required</small>
            }
            @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']) {
              <small class="p-error">Invalid email format</small>
            }
          </div>

          <div class="form-field">
            <label for="password">Password *</label>
            <p-password 
              id="password" 
              formControlName="password"
              placeholder="Enter password"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
            />
            @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']) {
              <small class="p-error">Password is required</small>
            }
            @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']) {
              <small class="p-error">Password must be at least 6 characters</small>
            }
          </div>

          <button 
            pButton 
            type="submit" 
            label="Register"
            class="w-full mt-4"
            [loading]="isLoading()"
            [disabled]="registerForm.invalid || isLoading()"
          ></button>
        </form>

        <div class="register-footer">
          <p>
            Already have an account? 
            <a routerLink="/auth/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1565c0 100%);
      padding: 1rem;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .register-header {
      text-align: center;
      margin-bottom: 2rem;

      .logo {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #1a237e, #0d47a1);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;

        i {
          font-size: 2rem;
          color: white;
        }
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a237e;
        margin: 0 0 0.5rem;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field {
      margin-bottom: 1.25rem;

      label {
        display: block;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
    }

    .register-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);

      p {
        margin: 0;
        color: var(--text-secondary);
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = signal(false);

  registerForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.toastr.success('Registration successful', 'Welcome!');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
}

