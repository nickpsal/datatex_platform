import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + '=([^;]*)'));
  return match ? match[1] : null;
}

@Component({
  selector: 'app-tiny-editor',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule],
  template: `
    <editor
      apiKey="n573esuf2ge8g2esprotmx1g1ets33226z43mkiwoyq4g9em"   
      [init]="init"
      [disabled]="disabled"
      [(ngModel)]="value"
      (onInit)="onInit($event)"
      (ngModelChange)="onModelChange($event)"
    ></editor>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TinyEditorComponent), multi: true },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'https://cdn.tiny.cloud/1/n573esuf2ge8g2esprotmx1g1ets33226z43mkiwoyq4g9em/tinymce/8/tinymce.min.js' }
  ]
})
export class TinyEditorComponent implements ControlValueAccessor {
  /** Laravel endpoint για image upload, π.χ. /api/ck-media ή /api/tiny-image */
  @Input({ required: true }) uploadUrl!: string;

  /** Προαιρετικό: override TinyMCE options */
  @Input() options: Record<string, any> = {};

  /** Εκπομπές */
  @Output() ready = new EventEmitter<any>();
  @Output() change = new EventEmitter<string>();

  value = '';
  disabled = false;

  // Default config (μόνο free plugins)
  init: any = {
    base_url: 'https://cdn.tiny.cloud/1/n573esuf2ge8g2esprotmx1g1ets33226z43mkiwoyq4g9em/tinymce/8',
    suffix: '.min',
    height: 600,
    resize: false,
    menubar: false,
    branding: false,
    statusbar: true,
    toolbar_mode: 'sliding',

    plugins: 'lists link image table code media paste wordcount',
    toolbar: [
      // ➕ βάλαμε "styles" για γρήγορη επιλογή Float
      'undo redo | styles blocks | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media table | removeformat | code'
    ].join(' '),

    paste_data_images: false,

    // ➕ Προσθήκη κλάσεων για εικόνες (Float Left/Right) στο Image dialog
    image_advtab: true,
    image_class_list: [
      { title: '— None —', value: '' },
      { title: 'Float left', value: 'float-left' },
      { title: 'Float right', value: 'float-right' }
    ],

    // ➕ Ίδιες επιλογές και από το "Styles" dropdown
    style_formats: [
      {
        title: 'Images',
        items: [
          { title: 'Float left', selector: 'img', classes: 'float-left' },
          { title: 'Float right', selector: 'img', classes: 'float-right' }
        ]
      }
    ],
    style_formats_autohide: true,

    // ➕ CSS μέσα στο iframe του editor για το τύλιγμα κειμένου
    content_style: `
    img.float-left{ float:left; margin:0 12px 12px 0; max-width:45%; height:auto; }
    img.float-right{ float:right; margin:0 0 12px 12px; max-width:45%; height:auto; }
    @media (max-width:640px){
      img.float-left, img.float-right{ float:none; margin:0 0 12px 0; max-width:100%; }
    }
  `,

    // (ό,τι είχες για upload handler – το κρατάς όπως είναι)
    images_upload_handler: (blobInfo: any, progress: (p: number) => void) => { /* ...όπως το έχεις... */ }
  };


  // ControlValueAccessor
  writeValue(val: any): void { this.value = val ?? ''; }
  registerOnChange(fn: any): void { this.propagateChange = fn; }
  registerOnTouched(fn: any): void { this.propagateTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  private propagateChange: (val: any) => void = () => { };
  private propagateTouched: () => void = () => { };

  onInit(editor: any) {
    // Merge εξωτερικών options αν δοθούν
    if (this.options && Object.keys(this.options).length) {
      Object.assign(this.init, this.options);
    }
    this.ready.emit(editor);
  }

  onModelChange(val: string) {
    this.value = val;
    this.propagateChange(val);
    this.change.emit(val);
  }
}
