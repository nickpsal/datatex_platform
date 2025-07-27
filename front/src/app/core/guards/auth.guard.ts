// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
	const auth = inject(AuthService);
	const router = inject(Router);

	return auth.checkAuth().pipe(
		map(isAuth => {
			if (!isAuth) {
				router.navigate(['/login']);
				return false;
			}
			return true;
		}),
		catchError(() => {
			router.navigate(['/login']);
			return of(false);
		})
	);
};
