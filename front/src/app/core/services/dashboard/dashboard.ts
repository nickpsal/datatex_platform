import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.API_URL}/admin/stats`, {withCredentials: true}).pipe(
            map((response: any) => response.data)
        );
    }

}