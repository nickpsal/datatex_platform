import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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
	private http = inject(HttpClient);
	private router = inject(Router);
	private readonly API_URL = environment.apiUrl;

	login(payload: loginPayload): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/login`, payload, {
			withCredentials: true
		});
	}

	logout(): Observable<any> {
		return this.http.post(`${this.API_URL}/logout`, {}, {
			withCredentials: true
		}).pipe(
			tap(() => this.router.navigate(['/login']))
		);
	}
}
