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
  /** Laravel endpoint για image upload, π.χ. /api/tiny-image */
  @Input({ required: true }) uploadUrl!: string;

  /** Προαιρετικό: override TinyMCE options */
  @Input() options: Record<string, any> = {};

  /** Εκπομπές */
  @Output() ready = new EventEmitter<any>();
  @Output() change = new EventEmitter<string>();

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

    /** ➕ Προσθέσαμε 'pagebreak' για Read More */
    plugins: 'lists link image table code media paste wordcount pagebreak',

    /** ➕ Προσθέσαμε κουμπί pagebreak + custom "Read more" */
    toolbar: [
      'undo redo | styles blocks | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media table | ' +
      'pagebreak readmorebtn | removeformat | code'
    ].join(' '),

    paste_data_images: false,

    // Image dialog classes
    image_advtab: true,
    image_class_list: [
      { title: '— None —', value: '' },
      { title: 'Float left', value: 'float-left' },
      { title: 'Float right', value: 'float-right' }
    ],

    // Style formats για εικόνες
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

    /** ➕ Ο separator που θα αποθηκεύεται στον HTML είναι ακριβώς <!--more--> */
    pagebreak_separator: '<!--more-->',
    /** Προαιρετικά: για να σπάει block πριν/μετά τον separator */
    pagebreak_split_block: true,

    // CSS μέσα στο iframe του editor
    content_style: `
      img.float-left{ float:left; margin:0 12px 12px 0; max-width:45%; height:auto; }
      img.float-right{ float:right; margin:0 0 12px 12px; max-width:45%; height:auto; }
      @media (max-width:640px){
        img.float-left, img.float-right{ float:none; margin:0 0 12px 0; max-width:100%; }
      }
      /* Ορατή σήμανση του Read More όταν ο TinyMCE δείχνει placeholder */
      .mce-pagebreak { display:block; position:relative; padding:8px 12px; border:1px dashed #999; }
      .mce-pagebreak:after{
        content:'READ MORE';
        position:absolute; top:-10px; left:12px; font-size:11px; background:#fff; padding:0 6px;
        color:#555; letter-spacing:0.04em;
      }
    `,

    /**
     * Αν έχεις ήδη ανεβασμένο handler, κράτα τον.
     * Εδώ αφήνω placeholder για συντομία:
     */
    images_upload_handler: (blobInfo: any, progress: (p: number) => void) => {
      // ...όπως το έχεις ήδη υλοποιήσει...
      return Promise.reject('images_upload_handler not implemented in this snippet');
    },

    /** ➕ setup: δηλώνουμε custom κουμπί και εξασφαλίζουμε "ένας μόνο" read more */
    setup: (editor: any) => {
      // Custom κουμπί, αν δεν θες το default pagebreak
      editor.ui.registry.addButton('readmorebtn', {
        icon: 'insert-time', // ή text: 'Read more'
        tooltip: 'Insert Read more',
        onAction: () => {
          insertSingleReadMore(editor);
        },
      });

      // Προσθέτουμε και στο context menu αν θέλεις
      editor.ui.registry.addMenuItem('readmorebtn', {
        text: 'Insert Read more',
        onAction: () => insertSingleReadMore(editor),
      });
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
