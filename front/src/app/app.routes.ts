// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout';
import { ArticleDetailsComponent } from './pages/article-details/article-details';
import { PortofolioComponent } from './pages/portofolio/portofolio';
import { BioComponent } from './pages/bio/bio';
import { UserProfileComponent } from './pages/user-profile/user-profile';
import { ArticlesTable } from './tables/articles-table/articles-table';
import { TinyDemoComponent } from './pages/tiny-demo/tiny-demo-component/tiny-demo-component';
import { NewArticleComponent } from './pages/new-article/new-article-component/new-article-component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Datatex.gr - Home' },
      { path: 'tiny-demo', component: TinyDemoComponent, title: 'Datatex.gr - TinyMCE Demo' },
      { path: 'home', component: HomeComponent, title: 'Datatex.gr - Home' },
      { path: 'blog/:category/:slug', component: ArticleDetailsComponent , title: 'Datatex.gr - Article Details' },
      { path: 'portofolio', component: PortofolioComponent, title: 'Datatex.gr - Portfolio' },
      { path: 'bio', component: BioComponent, title: 'Datatex.gr - Bio' },
      { path: 'user-profile', component: UserProfileComponent, title: 'Datatex.gr - User Profile' },
      { path: 'admin', component: DashboardComponent, canActivate: [authGuard], title: 'Datatex.gr - Admin' },
      { path: 'admin/articles', component: ArticlesTable, canActivate: [authGuard], title: 'Datatex.gr - Admin - Articles'},
      { path: 'admin/articles/new', component: NewArticleComponent, canActivate: [authGuard], title: 'Datatex.gr - Admin - New Article' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
