import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [authGuard]
    }
];
