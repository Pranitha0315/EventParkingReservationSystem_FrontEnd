import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { apiErrorMessage } from '../../../core/utils/api-error';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({ selector: 'app-receipt', standalone: true, imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent], templateUrl: './receipt.component.html' })
export class ReceiptComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PaymentService);
  readonly content = signal('');
  readonly loading = signal(true);
  readonly error = signal('');
  readonly downloaded = signal(false);
  paymentId = 0;

  ngOnInit(): void {
    this.paymentId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true); this.error.set('');
    this.service.receipt(this.paymentId).subscribe({
      next: content => { this.content.set(content); this.loading.set(false); },
      error: error => { this.error.set(apiErrorMessage(error)); this.loading.set(false); }
    });
  }

  receiptLines(): string[] {
    return this.content().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  }

  eventWatermark(): string {
    const lines = this.receiptLines();
    const eventLine = lines.find(line => /^event(?:\s+name)?\s*[:=-]/i.test(line));
    if (eventLine) {
      const value = eventLine.replace(/^event(?:\s+name)?\s*[:=-]\s*/i, '').trim();
      if (value) return value.slice(0, 42);
    }

    const likelyEventLine = lines.find(line => /event/i.test(line) && !/event\s*&\s*parking|reservation system|receipt/i.test(line));
    if (likelyEventLine) return likelyEventLine.replace(/^.*?event\s*[:=-]?\s*/i, '').trim().slice(0, 42) || 'EVENT PASS';
    return 'EVENT PASS';
  }

  print(): void { window.print(); }

  downloadReceipt(): void {
    if (!this.content()) return;
    const safe = this.escapeHtml(this.content()).replace(/\r?\n/g, '<br>');
    const watermark = this.escapeHtml(this.eventWatermark());
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>EPRS Receipt ${this.paymentId}</title><style>body{margin:0;background:#edf4f6;font-family:Arial,sans-serif;color:#153646;padding:40px}.receipt{position:relative;max-width:760px;margin:auto;background:#fff;border-radius:28px;box-shadow:0 20px 60px rgba(10,50,70,.14);overflow:hidden}.watermark{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) rotate(-24deg);width:120%;text-align:center;font-weight:900;font-size:64px;letter-spacing:.08em;color:rgba(14,101,128,.055);white-space:nowrap;pointer-events:none}.head{position:relative;z-index:2;padding:28px 34px;background:linear-gradient(135deg,#0e5068,#1887a6);color:#fff}.brand{font-weight:800;font-size:13px;letter-spacing:.12em}.head h1{margin:12px 0 4px;font-size:34px}.paid{display:inline-block;margin-top:12px;padding:7px 12px;background:#d9f7e5;color:#087443;border-radius:999px;font-weight:800}.body{position:relative;z-index:2;padding:34px;font-family:Consolas,monospace;line-height:1.8;white-space:normal}.foot{position:relative;z-index:2;padding:22px 34px;border-top:1px dashed #c9d8de;color:#66808d;font-size:13px;text-align:center}@media print{body{padding:0;background:#fff}.receipt{box-shadow:none}}</style></head><body><div class="receipt"><div class="watermark">${watermark}</div><div class="head"><div class="brand">EVENT & PARKING RESERVATION SYSTEM</div><h1>Payment Receipt</h1><div>Receipt #${this.paymentId}</div><span class="paid">✓ PAYMENT RECORDED</span></div><div class="body">${safe}</div><div class="foot">Event watermark: ${watermark}<br>Thank you for booking with Event & Parking.</div></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `EPRS-Receipt-${this.paymentId}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    this.downloaded.set(true);
    window.setTimeout(() => this.downloaded.set(false), 2500);
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char));
  }
}
