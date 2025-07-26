// src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeKey = 'darkMode';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem(this.darkModeKey, 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem(this.darkModeKey, 'dark');
    }
  }

  loadTheme(): void {
    const saved = localStorage.getItem(this.darkModeKey);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
