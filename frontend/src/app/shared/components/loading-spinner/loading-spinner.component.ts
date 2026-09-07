import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template:`<div class="loading-state" role="status"><span class="spinner"></span><span>{{ label }}</span></div>`

})
export class LoadingSpinnerComponent { @Input() label = 'Loading...'; }
