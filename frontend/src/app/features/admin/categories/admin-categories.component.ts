import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({ selector: 'app-admin-categories', standalone: true, imports: [FormsModule, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent], templateUrl: './admin-categories.component.html' })
export class AdminCategoriesComponent {
}