import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  animations: [
    trigger('backdrop', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('180ms ease-out')),
    ]),
    trigger('popup', [
      transition('void => *', [
        style({ transform: 'translateY(10px) scale(0.95)', opacity: 0 }),
        animate(
          '200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          style({ transform: 'none', opacity: 1 })
        ),
      ]),
      transition('* => void', [
        animate(
          '150ms ease-in',
          style({ transform: 'translateY(8px) scale(0.98)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class PopupComponent {
  @Input() visible = false;
  @Input() title = 'Popup';
  @Output() closed = new EventEmitter<void>();

  // Close on ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.visible) this.close();
  }

  close() {
    this.closed.emit();
  }

  // to stop click bubbling from content to backdrop
  stop(e: MouseEvent) {
    e.stopPropagation();
  }
}
