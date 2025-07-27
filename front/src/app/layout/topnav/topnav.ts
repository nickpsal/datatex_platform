import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme/theme';
import { AuthService } from '../../core/services/auth/auth';
import { Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
	selector: 'app-topnav',
	standalone: true,
	imports: [CommonModule, RouterModule, MatMenuModule],
	templateUrl: './topnav.html',
	styleUrls: ['./topnav.scss']
})
export class Topnav implements OnInit {
	user$: Observable<any> | null = null;
	isAdmin$: Observable<boolean> | null = null;

	constructor(private theme: ThemeService, private authService: AuthService, private router: Router) { }

	ngOnInit(): void {
		if (this.authService.hasJwtCookie()) {
			this.authService.checkAuth().subscribe();
			this.isAdmin$ = this.authService.isAdmin();
			this.user$ = this.authService.user$;
		}
	}

	get isDark() {
		return this.theme.isDarkMode();
	}

	toggleDarkMode() {
		this.theme.toggleTheme();
	}

	logout() {
		this.authService.logout();
		this.user$ = null;
		this.isAdmin$ = null;
		this.router.navigate(['/home']);
	}
}
