import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isSidebarOpen } from '../../shared/sidebar.store';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  isToggled = isSidebarOpen;

  toggleSidebar() {
    this.isToggled.update(v => !v);
  }
}
