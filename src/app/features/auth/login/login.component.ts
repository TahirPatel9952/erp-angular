import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <i class="pi pi-building"></i>
          </div>
          <h1>Manufacturing ERP</h1>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label for="usernameOrEmail">Username or Email</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-user"></i>
              <input 
                pInputText 
                id="usernameOrEmail" 
                formControlName="usernameOrEmail"
                placeholder="Enter username or email"
                class="w-full"
              />
            </span>
            @if (loginForm.get('usernameOrEmail')?.touched && loginForm.get('usernameOrEmail')?.errors?.['required']) {
              <small class="p-error">Username or email is required</small>
            }
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <p-password 
              id="password" 
              formControlName="password"
              placeholder="Enter password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
              <small class="p-error">Password is required</small>
            }
          </div>

          <div class="form-options">
            <p-checkbox 
              formControlName="rememberMe"
              [binary]="true"
              label="Remember me"
            />
            <a routerLink="/auth/forgot-password" class="forgot-link">
              Forgot password?
            </a>
          </div>

          <button 
            pButton 
            type="submit" 
            label="Sign In"
            class="w-full mt-4"
            [loading]="isLoading()"
            [disabled]="loginForm.invalid || isLoading()"
          ></button>
        </form>

        <div class="login-footer">
          <p>
            Don't have an account? 
            <a routerLink="/auth/register">Register</a>
          </p>
        </div>

        <div class="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: admin / Password: Admin&#64;123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1565c0 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .login-header {
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

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: var(--primary-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .login-footer {
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

    .demo-credentials {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 6px;
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-secondary);

      p {
        margin: 0.25rem 0;
      }
    }

    :host ::ng-deep {
      .p-password {
        width: 100%;
      }

      .p-inputtext {
        width: 100%;
      }
    }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.toastr.success('Login successful', 'Welcome!');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
}

