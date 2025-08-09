import { Component, AfterViewInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ApiService } from '../../core/services/api/api';
import { Article } from '../../core/interfaces/article';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { isSidebarOpen } from '../../shared/sidebar.store';

@Component({
  selector: 'app-articles-table',
  standalone: true,
  imports: [SidebarComponent, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './articles-table.html',
  styleUrl: './articles-table.scss'
})
export class ArticlesTable implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private api = inject(ApiService);

  // state
  limit = signal(10);
  offset = signal(0);
  sort_by = signal<string>('created_at');
  sort_order = signal<'asc' | 'desc'>('desc');

  // derived για template (αντί για Math στο HTML)
  pageIndex = computed(() => Math.floor(this.offset() / this.limit()));

  total = 0;
  data: Article[] = [];
  isLoading = true;
  isToggled = isSidebarOpen;

  displayedColumns = ['id', 'title', 'category', 'author', 'created_at', 'updated_at'];

  ngAfterViewInit(): void {
    // φορτώνουμε μετά το πρώτο render -> δεν σκάει το NG0100
    queueMicrotask(() => this.load());
  }

  onPage(e: PageEvent) {
    this.limit.set(e.pageSize);
    this.offset.set(e.pageIndex * e.pageSize);
    this.load();
  }

  onSort(s: Sort) {
    this.sort_by.set(s.active || 'created_at');
    this.sort_order.set((s.direction || 'asc') as 'asc' | 'desc');
    this.offset.set(0); // reset στη 1η σελίδα
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.api.getArticles({
      limit: this.limit(),
      offset: this.offset(),
      sort_by: this.sort_by(),
      sort_order: this.sort_order()
    }).subscribe(res => {
      this.data = [...(res.data ?? [])];      
      this.total = Number(res.total) || 0;
      if (res.limit != null) this.limit.set(Number(res.limit));
      if (res.offset != null) this.offset.set(Number(res.offset));
      this.isLoading = false;
      this.cdr.markForCheck(); 
    });
  }

  trackById = (_: number, r: Article) => r.id;

  toggleSidebar() { this.isToggled.update(v => !v); }
}
