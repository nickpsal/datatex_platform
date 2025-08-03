import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/interfaces/article';
import { ApiService } from '../../core/services/api/api';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    RouterModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  isLoading = signal(true);

  public safeExcerpt: (html: string) => SafeHtml;

  articles$: Observable<Article[]> | null = null;

  trackByFn(index: number, article: Article): number {
    return article.id;
  }

  constructor(private api: ApiService, private sanitizer: DomSanitizer) {
    this.safeExcerpt = (html: string) => this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    this.articles$ = this.api.getArticles();
    this.articles$.subscribe(() => this.isLoading.set(false));
  }

}
