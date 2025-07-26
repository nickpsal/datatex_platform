import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme';

@Component({
	selector: 'app-topnav',
	imports: [CommonModule, RouterModule],
	templateUrl: './topnav.html',
	styleUrl: './topnav.scss'
})
export class Topnav {
	constructor(private theme: ThemeService) { }
	get isDark() {
		return this.theme.isDarkMode();
	}

	toggleDarkMode() {
		this.theme.toggleTheme();
	}
}
