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
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  // server-side conditions
  limit = signal(10);
  offset = signal(0);
  sort_by = signal<string>('created_at');
  sort_order = signal<'asc' | 'desc'>('desc');
  isLoading = signal(true);

  public safeExcerpt: (html: string) => SafeHtml;

  articles: Article[] = [];

  trackByFn(index: number, article: Article): number {
    return article.id;
  }

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {
    this.safeExcerpt = (html: string) => this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    this.apiService.getArticles({
      limit: this.limit(),
      offset: this.offset(),
      sort_by: this.sort_by(),
      sort_order: this.sort_order()
    }).subscribe(res => {
      this.articles = res.data;
      this.isLoading.set(false);
    });
  }

}
