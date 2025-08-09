import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor: any = ClassicEditor;

@Component({
  selector: 'app-article-editor-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './article-editor-page.html',
  styleUrl: './article-editor-page.scss'
})
export class ArticleEditorPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  Editor = Editor;
  editorConfig = {
    placeholder: 'Γράψε το άρθρο...',
    toolbar: [
      'heading','|','bold','italic','underline','link',
      '|','bulletedList','numberedList','blockQuote',
      '|','insertTable','undo','redo','imageUpload'
    ]
  };

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: [''],
    content: ['', [Validators.required, Validators.minLength(5)]],
  });

  cancel() {
    this.router.navigate(['/articles']);
  }

  save() {
    if (this.form.invalid) return;

    const payload = {
      title: this.form.value.title!,
      category: this.form.value.category ?? '',
      content: this.form.value.content!
    };

    // TODO: κάλεσε εδώ το API σου (Laravel 12)
    // this.core.postData('articles', payload).subscribe(() => this.router.navigate(['/articles']));

    console.log('CREATE ARTICLE payload:', payload);
    // this.router.navigate(['/articles']);
  }
}
