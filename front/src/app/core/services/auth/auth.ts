import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ApiService } from '../api/api';

interface loginPayload {
	email: string;
	password: string;
}

interface LoginResponse {
	access_token: string;
	user: any;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private api = inject(ApiService);
	private router = inject(Router);

	private userSubject = new BehaviorSubject<any | null>(null);
	user$ = this.userSubject.asObservable();

	get currentUser() {
		return this.userSubject.value;
	}

	login(payload: loginPayload): Observable<any> {
		return this.api.login(payload).pipe(
			tap(res => this.userSubject.next(res.user))
		);
	}

	logout(): void {
		this.api.logout().pipe(
			catchError(() => of(null)),
			tap(() => {
				this.userSubject.next(null);
				this.router.navigate(['/home']);
			})
		).subscribe();
	}

	hasJwtCookie(): boolean {
		return document.cookie.includes('token=');
	}

	hasThemeCookie(): string | null {
		const match = document.cookie.match(/darkMode=([^;]+)/);
		return match ? match[1] : null;
	}

	checkAuth(): Observable<boolean> {
		return this.api.getCurrentUser().pipe(
			tap(user => this.userSubject.next(user)),
			map(() => true),
			catchError(() => {
				this.userSubject.next(null);
				return of(false); // ❗ χωρίς redirect εδώ
			})
		);
	}

	isAdmin(): Observable<boolean> {
		return this.api.isAdmin().pipe(
			map(response => response.isAdmin === true),
			catchError(() => of(false)) // αν αποτύχει (401 ή άλλο), επιστρέφουμε false
		);
	}

}
