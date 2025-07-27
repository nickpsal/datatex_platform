import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface LoginPayload {
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    login(payload: LoginPayload): Observable<any> {
        return this.http.post(`${this.API_URL}/login`, payload, {
            withCredentials: true
        });
    }

    logout(): Observable<any> {
        return this.http.post(`${this.API_URL}/logout`, {}, {
            withCredentials: true
        });
    }

    getCurrentUser(): Observable<any> {
        return this.http.get(`${this.API_URL}/me`, {
            withCredentials: true
        });
    }

    isAdmin(): Observable<{ isAdmin: boolean }> {
        return this.http.get<{ isAdmin: boolean }>(`${this.API_URL}/isadmin`, {
            withCredentials: true // για cookie-based JWT
        });
    }

}
