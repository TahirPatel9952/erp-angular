import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { ApiResponse } from '../../models/api-response.model';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/v1/auth`;

  // Signals for reactive state
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  private isAuthenticatedSignal = signal<boolean>(this.hasToken());

  // Computed signals
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.isAuthenticatedSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role || '');
  readonly userPermissions = computed(() => this.currentUserSignal()?.permissions || []);

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.storeTokens(response.data);
          this.storeUser(response.data.user);
          this.currentUserSignal.set(response.data.user);
          this.isAuthenticatedSignal.set(true);
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.storeTokens(response.data);
          this.storeUser(response.data.user);
          this.currentUserSignal.set(response.data.user);
          this.isAuthenticatedSignal.set(true);
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh-token`, null, {
        params: { refreshToken: refreshToken || '' },
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.storeTokens(response.data);
            this.storeUser(response.data.user);
            this.currentUserSignal.set(response.data.user);
          }
        }),
        catchError((error) => throwError(() => error))
      );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, null).subscribe({
        complete: () => this.clearAuthData(),
        error: () => this.clearAuthData(),
      });
    } else {
      this.clearAuthData();
    }
  }

  hasPermission(permission: string): boolean {
    const permissions = this.currentUserSignal()?.permissions || [];
    const role = this.currentUserSignal()?.role;
    return permissions.includes(permission) || role === 'ADMIN';
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.role === role;
  }

  hasAnyRole(...roles: string[]): boolean {
    const userRole = this.currentUserSignal()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  private storeTokens(authResponse: AuthResponse): void {
    localStorage.setItem(environment.tokenKey, authResponse.accessToken);
    localStorage.setItem(environment.refreshTokenKey, authResponse.refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private clearAuthData(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/auth/login']);
  }
}

