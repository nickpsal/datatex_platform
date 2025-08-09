import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule],
  templateUrl: './text-editor.html',
  styleUrls: ['./text-editor.css']
})
export class TextEditorComponent {
  @Input() content: string = ''; // Αρχικό περιεχόμενο
  @Output() contentChange = new EventEmitter<string>();

  public Editor: any = ClassicEditor;

  onChange({ editor }: any) {
    const data = editor.getData();
    this.contentChange.emit(data);
  }
}
