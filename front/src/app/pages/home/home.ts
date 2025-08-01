import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/interfaces/article';
import { ApiService } from '../../core/services/api/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    NgFor,
    NgIf,
    RouterModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  isLoading = signal(true);

  articles$: Observable<Article[]> | null = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.articles$ = this.api.getArticles();
    this.articles$.subscribe(() => this.isLoading.set(false));
  }

}
