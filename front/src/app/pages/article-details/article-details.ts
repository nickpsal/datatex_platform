import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Article } from '../../core/interfaces/article';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api/api';

@Component({
  standalone: true,
  selector: 'app-article-details',
  imports: [CommonModule],
  templateUrl: './article-details.html',
  styleUrls: ['./article-details.scss']
})
export class ArticleDetailsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  article$: Observable<Article> | null = null;

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.article$ = this.api.getArticleBySlug(slug);
      this.article$.subscribe(article => {
        console.log('Article fetched:', article);
      });
    }
  }
}
