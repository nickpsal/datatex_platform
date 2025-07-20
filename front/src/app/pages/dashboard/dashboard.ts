import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { isSidebarOpen } from '../../shared/sidebar.store';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  isToggled = isSidebarOpen;

  toggleSidebar() {
    this.isToggled.update(v => !v);
  }
}