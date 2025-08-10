import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api/api';
import { TinyEditorComponent } from '../../../components/tinymce/tiny-editor-component/tiny-editor-component';

type SubmitMode = 'draft' | 'publish';

interface ArticlePayload {
  title: string;
  category: string;
  content: string;
  status: 'draft' | 'published';
}

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TinyEditorComponent],
  templateUrl: './new-article-component.html',
})
export class NewArticleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ApiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  categoryList: { id: number; name: string }[] = [];

  ngOnInit(): void {
    this.ApiService.getCategoriesDropdown().subscribe({
      next: (data) => {
        this.categoryList = data;
      },
      error: (error) => {
        this.errorMsg.set(error);
      },
    });
  }

  // UI state (signals)
  loading = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);

  // Reactive form (nonNullable για καθαρά types)
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    category: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  hasError(controlName: 'title' | 'category' | 'content'): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.touched && c.invalid);
  }

  onSubmit(mode: SubmitMode): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ArticlePayload = {
      ...this.form.getRawValue(),
      status: mode === 'draft' ? 'draft' : 'published',
    };
  }
}
