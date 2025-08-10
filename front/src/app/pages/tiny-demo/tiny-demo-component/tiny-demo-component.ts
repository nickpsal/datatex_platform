import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TinyEditorComponent } from '../../../components/tinymce/tiny-editor-component/tiny-editor-component';

@Component({
  selector: 'app-tiny-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TinyEditorComponent],
  template: `
    <div class="p-4 space-y-4">
      <form [formGroup]="form" class="space-y-3">
        <label class="block text-sm font-medium">Περιγραφή</label>
        <app-tiny-editor
          formControlName="content"
          [uploadUrl]="'/api/tiny-image'"
        ></app-tiny-editor>

        <button type="button" class="px-4 py-2 rounded bg-gray-900 text-white" (click)="log()">
          Log value
        </button>
      </form>

      <div class="text-sm text-gray-600">
        <strong>Τρέχον περιεχόμενο:</strong>
        <pre class="whitespace-pre-wrap">{{ form.value.content }}</pre>
      </div>
    </div>
  `
})
export class TinyDemoComponent {
  form;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      content: '<p>Hello TinyMCE!</p>'
    });
  }
  log() { console.log(this.form.value.content); }
}
