// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Datatex Platform - Home' },
      { path: 'home', component: HomeComponent, title: 'Datatex Platform - Home' },
      { path: 'admin', component: DashboardComponent, canActivate: [authGuard], title: 'Datatex Platform - Admin' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
