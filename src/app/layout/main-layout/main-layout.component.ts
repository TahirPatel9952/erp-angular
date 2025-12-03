import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout-container">
      <app-sidebar 
        [collapsed]="sidebarCollapsed()" 
        (toggleCollapse)="toggleSidebar()" 
      />
      <div class="layout-content" [class.sidebar-collapsed]="sidebarCollapsed()">
        <app-header (toggleSidebar)="toggleSidebar()" />
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--background-color);
    }

    .layout-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s ease;
      
      &.sidebar-collapsed {
        margin-left: 64px;
      }
    }

    .main-content {
      flex: 1;
      padding: 1.5rem;
      margin-top: var(--header-height);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .layout-content {
        margin-left: 0;
      }
    }
  `],
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }
}

