import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../../core/services/api/api';
import { TinyEditorComponent } from '../../../components/tinymce/tiny-editor-component/tiny-editor-component';
import { FeaturedUploadResponse } from '../../../core/interfaces/image_upload';
import { HttpEventType } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ArticlePayload {
  title: string;
  category_id: string;
  user_id: string;
  featured_image: string;
  full_content: string;
  status: string;
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

  featuredUploading = signal(false);
  featuredProgress = signal(0);
  featuredError = signal<string | null>(null);
  featuredUrl = signal<string | null>(null);

  categoryList: { id: number; name: string }[] = [];
  usersList: { id: number; name: string }[] = [];

  SubmitMode = [
    'draft',
    'published',
    'unpublished'
  ];

  ngOnInit(): void {
    this.ApiService.getCategoriesDropdown().subscribe({
      next: (data) => {
        this.categoryList = data;
      },
      error: (error) => {
        this.errorMsg.set(error);
      },
    });

    this.ApiService.getUsersDropdown().subscribe({
      next: (data) => {
        this.usersList = data;
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
    category_id: ['', [Validators.required]],
    user_id: ['', [Validators.required]],
    featured_image: ['', [Validators.required]],
    full_content: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  hasError(controlName: 'title' | 'category_id' | 'full_content' | 'user_id' | 'status' | 'featured_image'): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.touched && c.invalid);
  }

  onFeaturedPicked(ev: Event) {
    this.featuredError.set(null);
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validation με βάση το backend: jpeg|png|jpg|gif και max 2MB
    const okTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!okTypes.includes(file.type)) {
      this.featuredError.set('Δεκτά: JPEG, PNG, JPG, GIF.');
      input.value = '';
      return;
    }
    const MAX_MB = 2;
    if (file.size > MAX_MB * 1024 * 1024) {
      this.featuredError.set(`Μέγιστο μέγεθος: ${MAX_MB}MB.`);
      input.value = '';
      return;
    }

    this.featuredUploading.set(true);
    this.featuredProgress.set(0);

    this.ApiService.uploadFeaturedImage(file)
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.featuredUrl.set(res.url);
            this.form.patchValue({ featured_image: res.url }, { emitEvent: false });
          } else {
            this.featuredError.set(res.message || 'Αποτυχία ανεβάσματος.');
          }
        },
        error: (err) => {
          this.featuredError.set(err?.error?.message || 'Αποτυχία ανεβάσματος.');
        }
      });
  }

  clearFeatured() {
    this.featuredUrl.set(null);
    this.featuredProgress.set(0);
    this.featuredError.set(null);
    this.form.patchValue({ featured_image: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ArticlePayload = {
      ...this.form.getRawValue()
    };
  }
}
