import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent)
    },
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
