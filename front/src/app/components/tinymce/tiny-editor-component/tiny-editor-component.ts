import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '../../../core/services/api/api';
import { lastValueFrom } from 'rxjs';

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
  /** Laravel endpoint για image upload, π.χ. /api/tiny-image */

  /** Προαιρετικό: override TinyMCE options */
  @Input() options: Record<string, any> = {};

  /** Εκπομπές */
  @Output() ready = new EventEmitter<any>();
  @Output() change = new EventEmitter<string>();
  @Input({ required: true }) uploadUrl!: string;

  private _ed: any;
  constructor(private api: ApiService) { }

  value = '';
  disabled = false;

  // Default config
  init: any = {
    base_url: 'https://cdn.tiny.cloud/1/n573esuf2ge8g2esprotmx1g1ets33226z43mkiwoyq4g9em/tinymce/8',
    suffix: '.min',
    height: 600,
    resize: false,
    menubar: false,
    branding: false,
    statusbar: true,
    toolbar_mode: 'sliding',

    plugins: 'lists link image table code media paste wordcount pagebreak',
    toolbar: [
      'undo redo | styles blocks | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media table | ' +
      'pagebreak readmorebtn | removeformat | code'
    ].join(' '),

    paste_data_images: false,

    image_advtab: true,
    image_description: true,
    a11y_advanced_options: true,
    extended_valid_elements: 'img[class|src|alt|title|width|height|style|role]',
    image_class_list: [
      { title: '— None —', value: '' },
      { title: 'Float left', value: 'float-left' },
      { title: 'Float right', value: 'float-right' }
    ],
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

    pagebreak_separator: '<!--more-->',
    pagebreak_split_block: true,

    content_style: `
    img.float-left{ float:left; margin:0 12px 12px 0; max-width:45%; height:auto; }
    img.float-right{ float:right; margin:0 0 12px 12px; max-width:45%; height:auto; }
    @media (max-width:640px){
      img.float-left, img.float-right{ float:none; margin:0 0 12px 0; max-width:100%; }
    }
    .mce-pagebreak { display:block; position:relative; padding:8px 12px; border:1px dashed #999; }
    .mce-pagebreak:after{
      content:'READ MORE';
      position:absolute; top:-10px; left:12px; font-size:11px; background:#fff; padding:0 6px;
      color:#555; letter-spacing:0.04em;
    }
  `,

    // === Upload εικόνας μέσω ApiService ===
    automatic_uploads: true,
    images_upload_credentials: true,
    file_picker_types: 'image',

    // Drag & drop / paste
    images_upload_handler: (blobInfo: any) => {
      const name = blobInfo.filename();
      return this.uploadViaApiService(blobInfo.blob(), name).then((url: string) => {
        // Μετά το upload, βάλε alt και αφαίρεσε το role="presentation"
        queueMicrotask(() => {
          const ed = this._ed;
          if (!ed) return;
          const node = ed.selection.getNode();
          if (node && node.nodeName === 'IMG') {
            node.setAttribute('alt', name);
            node.removeAttribute('role');
          }
        });
        return url;
      });
    },

    setup: (editor: any) => {
      this._ed = editor; // ⬅ κρατάμε ref στον editor

      // Όποτε αλλάζει περιεχόμενο: αν υπάρχει alt ≠ "", βγάλε το role="presentation"
      editor.on('Change', () => {
        editor.dom.select('img[alt]:not([alt=""])').forEach((img: any) => {
          img.removeAttribute('role');
        });
      });

      // ...ό,τι άλλο setup έχεις (π.χ. readmorebtn)...
    },

    // Dialog "Insert image"
    file_picker_callback: (cb: any, _value: any, meta: any) => {
      if (meta.filetype !== 'image') return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const url = await this.uploadViaApiService(file, file.name);
          cb(url, { alt: file.name, title: file.name });
        } catch (e) {
          console.error('Tiny upload error:', e);
          alert('Αποτυχία ανεβάσματος εικόνας.');
        }
      };
      input.click();
    },
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

  private async uploadViaApiService(fileOrBlob: Blob, filename: string): Promise<string> {
    // TinyMCE δίνει Blob -> το κάνουμε File γιατί συνήθως έτσι το περιμένει το ApiService
    const file =
      fileOrBlob instanceof File
        ? fileOrBlob
        : new File([fileOrBlob], filename, { type: (fileOrBlob as any).type || 'application/octet-stream' });

    const res: any = await lastValueFrom(this.api.uploadFeaturedImage(file));
    // Υποστήριξη και των 2 formats απάντησης
    if (res?.status === 'success' && res?.url) return res.url;
    if (res?.location) return res.location;
    if (res?.url) return res.url;

    throw new Error(res?.message || 'Αποτυχία ανεβάσματος.');
  }
}



/** Helper: βάζουμε πάντα ΜΟΝΟ έναν <!--more--> */
function insertSingleReadMore(editor: any) {
  // Παίρνουμε raw περιεχόμενο ώστε να εντοπίσουμε υπάρχον <!--more-->
  const raw = editor.getContent({ format: 'raw' });

  // Αν υπάρχει ήδη, απλώς κάνε focus εκεί (προαιρετικά), αλλιώς βάλε νέο.
  const hasMore = /<!--\s*more\s*-->/.test(raw);

  if (!hasMore) {
    // Εισάγουμε τον separator στο σημείο του cursor
    editor.insertContent('<!--more-->');
  } else {
    // Προαιρετικό: βρες το placeholder και κάνε scroll
    try {
      const body = editor.getBody();
      const walker = editor.dom.TreeWalker(body, body);
      let node: any;
      while ((node = walker.next())) {
        if (node.nodeType === 8 && /more/.test(node.data)) {
          // σχόλιο (Comment node) -> scroll προς τα εκεί
          (node as any).scrollIntoView?.({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    } catch {
      // no-op
    }
  }
}
