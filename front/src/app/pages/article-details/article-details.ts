import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-article-details',
  imports: [CommonModule],
  templateUrl: './article-details.html',
  styleUrls: ['./article-details.scss']
})
export class ArticleDetailsComponent {
  private route = inject(ActivatedRoute);
  article: any;

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    const slug = this.route.snapshot.paramMap.get('slug');

    console.log(`Category: ${category}, Slug: ${slug}`);
  }
}
