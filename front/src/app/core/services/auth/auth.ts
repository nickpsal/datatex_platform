import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ApiService } from '../api/api';

interface loginPayload {
	email: string;
	password: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private api = inject(ApiService);
	private router = inject(Router);

	private userSubject = new BehaviorSubject<any | null>(null);
	user$ = this.userSubject.asObservable();

	private isLoggedIn = signal(false);

	get currentUser() {
		return this.userSubject.value;
	}

	login(payload: loginPayload): Observable<any> {
		return this.api.login(payload).pipe(
			tap(res => {
				this.userSubject.next(res.user);
				this.isLoggedIn.set(true);
			})
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

	checkAuth(): Observable<boolean> {
		if (this.isLoggedIn()) {
			return this.api.getCurrentUser().pipe(
				tap(user => this.userSubject.next(user)),
				map(() => true),
				catchError(() => {
					this.userSubject.next(null);
					return of(false);
				})
			);
		}
		return of(false);
	}

	isAdmin(): Observable<boolean> {
		if (this.isLoggedIn()) {
			return this.api.isAdmin().pipe(
				map(response => response.isAdmin === true),
				catchError(() => of(false)) // αν αποτύχει (401 ή άλλο), επιστρέφουμε false
			);
		}
		return of(false);
	}
}
