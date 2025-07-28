import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  articles$: Observable<Article[]> | null = null;

  constructor (private api: ApiService) {}

  ngOnInit() {
    this.articles$ = this.api.getArticles();
    console.log('Articles fetched:', this.articles$);
  }
}
  