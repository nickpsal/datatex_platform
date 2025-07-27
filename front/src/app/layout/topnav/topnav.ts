import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';
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
		this.authService.checkAuth().subscribe();
		this.user$ = this.authService.user$;
		this.isAdmin$ = this.authService.isAdmin();
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
