import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { isSidebarOpen } from '../../shared/sidebar.store';
import { DashboardService } from '../../core/services/dashboard/dashboard';
import { DashboardStats } from '../../core/interfaces/dashboard';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  isToggled = isSidebarOpen;

  stats$: Observable<DashboardStats> | null = null;
  private dashboard = inject(DashboardService);
  loading = true;

  ngOnInit(): void {
    this.stats$ = this.dashboard.getDashboardStats();
    this.stats$.subscribe(() => this.loading = false);
  }

  toggleSidebar() {
    this.isToggled.update(v => !v);
  }
}