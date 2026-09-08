import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const message = error.error?.message;
    if (typeof message === 'string' && message.trim()) return message;
    if (error.status === 0) return 'Backend API is not reachable. Start the .NET API on http://localhost:5001.';
    return `Request failed (${error.status}).`;
  }
  return 'Something went wrong. Please try again.';
}
