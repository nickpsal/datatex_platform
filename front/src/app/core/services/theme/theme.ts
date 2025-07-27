import { Injectable } from '@angular/core';
import { CoreService } from '../core/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private darkModeKey = 'darkMode';

	constructor(private core: CoreService) {
		this.loadTheme();
	}

	toggleTheme(): void {
		const html = document.documentElement;
		const isDark = html.classList.contains('dark');

		if (isDark) {
			html.classList.remove('dark');
			this.core.setCookie(this.darkModeKey, 'light', 30);
		} else {
			html.classList.add('dark');
			this.core.setCookie(this.darkModeKey, 'dark', 30);
		}
	}

	loadTheme(): void {
		const saved = this.core.getCookie(this.darkModeKey);
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
