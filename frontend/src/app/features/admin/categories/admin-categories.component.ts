import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
// import { CategoryService } from '../../../core/services/category.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EventCategory } from '../../../core/models/category.model';

// @Component({ selector: 'app-admin-categories', standalone: true, imports: [FormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent], templateUrl: './admin-categories.component.html' })

// export class AdminCategoriesComponent {
//   private readonly service = inject(CategoryService);
// readonly items = signal<EventCategory[]>([]);
// readonly loading = signal(true);
// readonly saving = signal(false);
// readonly error = signal('');
// readonly success = signal('');
// readonly confirmOpen = signal(false);
// editingId: number | null = null;
// deleting: EventCategory | null = null;
// name = '';

// ngOnInit(): void { this.load(); }
// load(): void { this.loading.set(true); this.service.getAll(true).subscribe({ next: items => { this.items.set(items); this.loading.set(false); }, error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } }); }
// edit(item: EventCategory): void { this.editingId = item.eventCategoryId; this.name = item.name; }
// reset(): void { this.editingId = null; this.name = ''; }
// save(form: NgForm): void {
//   if (form.invalid || this.saving()) return;
//   this.saving.set(true); this.error.set('');
//   const request$ = this.editingId ? this.service.update(this.editingId, { name: this.name }) : this.service.create({ name: this.name });
//   request$.subscribe({ next: () => { this.saving.set(false); this.success.set(this.editingId ? 'Category updated.' : 'Category created.'); this.reset(); form.resetForm(); this.load(); }, error: error => { this.saving.set(false); this.error.set(apiErrorMessage(error)); } });
// }
// askDelete(item: EventCategory): void { this.deleting = item; this.confirmOpen.set(true); }
// remove(): void { if (!this.deleting) return; this.confirmOpen.set(false); this.service.delete(this.deleting.eventCategoryId).subscribe({ next: result => { this.success.set(result.message); this.deleting = null; this.load(); }, error: error => this.error.set(apiErrorMessage(error)) }); }
// }