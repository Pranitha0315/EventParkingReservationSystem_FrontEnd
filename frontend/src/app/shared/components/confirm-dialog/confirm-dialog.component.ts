import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `    @if (open) {
      <div class="dialog-backdrop" (click)="cancel.emit()">
        <section class="dialog-card" role="dialog" aria-modal="true" [attr.aria-label]="title" (click)="$event.stopPropagation()">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="actions end">
            <button class="btn btn-secondary" type="button" (click)="cancel.emit()">Cancel</button>
            <button class="btn" [class.btn-danger]="danger" type="button" (click)="confirm.emit()">{{ confirmText }}</button>
          </div>
        </section>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Input() danger = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

