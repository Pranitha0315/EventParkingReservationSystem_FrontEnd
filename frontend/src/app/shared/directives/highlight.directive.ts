import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @HostBinding('style.transform') transform = '';
  @HostListener('mouseenter') onEnter(): void { this.transform = 'translateY(-2px)'; }
  @HostListener('mouseleave') onLeave(): void { this.transform = ''; }
}
