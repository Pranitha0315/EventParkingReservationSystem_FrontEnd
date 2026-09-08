import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template:  `
    @if (message) {
      <div class="alert alert-error" role="alert">
        <span>{{ message }}</span>
        @if (retryable) { <button class="link-button" type="button" (click)="retry.emit()">Retry</button> }
      </div>
    }
  `
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() retryable = false;
  @Output() retry = new EventEmitter<void>();
}
