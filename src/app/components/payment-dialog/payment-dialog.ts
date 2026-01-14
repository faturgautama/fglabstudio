import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../services/pages/payment.service';
import { AuthenticationService } from '../../services/pages/authentication/authentication';
import {
  PaymentChannel,
  PaymentCategory,
  DirectPaymentData
} from '../../model/pages/payment.model';
import { Subscription } from 'rxjs';

type DialogState = 'loading' | 'select-method' | 'payment-details' | 'error';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './payment-dialog.html',
  styleUrl: './payment-dialog.scss',
})
export class PaymentDialog implements OnInit, OnDestroy {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthenticationService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  // Dialog state
  currentState: DialogState = 'loading';

  // Payment methods data
  paymentCategories: PaymentCategory[] = [];
  selectedChannel: PaymentChannel | null = null;

  // Payment details
  paymentData: DirectPaymentData | null = null;

  // Loading states
  isCreatingPayment = false;
  creatingChannelCode: string | null = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Data from parent
  userId: number = 0;
  appsId: number = 0;
  amount: number = 0;
  notifyUrl: string = '';

  ngOnInit(): void {
    // Get data from dialog config
    this.userId = this.config.data?.userId;
    this.appsId = this.config.data?.appsId;
    this.amount = this.config.data?.amount;
    this.notifyUrl = this.config.data?.notifyUrl;

    if (!this.userId || !this.appsId || !this.amount || !this.notifyUrl) {
      this.currentState = 'error';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing required payment data'
      });
      return;
    }

    // Check for existing pending transaction first
    this.checkExistingTransaction();
  }

  checkExistingTransaction(): void {
    this.currentState = 'loading';
    this.cdr.detectChanges();

    const sub = this.paymentService.getPendingTransaction(this.userId, this.appsId).subscribe({
      next: (transaction) => {
        if (transaction) {
          // Convert transaction to DirectPaymentData format
          this.paymentData = {
            session_id: transaction.session_id,
            transaction_id: parseInt(transaction.transaction_id),
            reference_id: transaction.reference_id,
            via: transaction.payment_method,
            channel: transaction.payment_channel,
            payment_no: transaction.payment_no,
            payment_name: transaction.payment_name,
            total: transaction.total,
            fee: transaction.fee,
            expired: transaction.expired_at,
            qr_image: transaction.qr_image || null,
            qr_string: transaction.qr_string || null,
          };

          setTimeout(() => {
            this.currentState = 'payment-details';
            this.cdr.detectChanges();

            // Start polling for this existing transaction
            this.startPollingTransaction(transaction.reference_id);
          });
        } else {
          // No pending transaction, show payment methods
          this.loadPaymentMethods();
        }
      },
      error: (error) => {
        // Continue to payment methods on error
        this.loadPaymentMethods();
      }
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPaymentMethods(): void {
    this.currentState = 'loading';
    this.cdr.detectChanges();

    const sub = this.paymentService.getPaymentMethods().subscribe({
      next: (response) => {
        if (response.Success && response.Data) {
          // Filter only VA and QRIS categories with channels
          this.paymentCategories = response.Data.filter(cat => {
            const isVaOrQris = cat.Code === 'va' || cat.Code === 'qris';
            const hasChannels = cat.Channels && Array.isArray(cat.Channels) && cat.Channels.length > 0;
            return isVaOrQris && hasChannels;
          });

          setTimeout(() => {
            this.currentState = 'select-method';
            this.cdr.detectChanges();
          });
        } else {
          setTimeout(() => {
            this.currentState = 'error';
            this.cdr.detectChanges();
          });
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load payment methods'
          });
        }
      },
      error: (error) => {
        setTimeout(() => {
          this.currentState = 'error';
          this.cdr.detectChanges();
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payment methods'
        });
      }
    });

    this.subscriptions.push(sub);
  }

  selectPaymentChannel(channel: PaymentChannel, category: PaymentCategory): void {
    this.selectedChannel = channel;
    this.creatingChannelCode = channel.Code;
    this.createPayment(category.Code, channel.Code);
  }

  createPayment(paymentMethod: string, paymentChannel: string): void {
    this.isCreatingPayment = true;
    this.cdr.detectChanges();

    const request = {
      user_id: this.userId,
      apps_id: this.appsId,
      payment_method: paymentMethod,
      payment_channel: paymentChannel,
      amount: this.amount,
      notify_url: this.notifyUrl,
      expired: 24,
      comments: 'Payment for application subscription'
    };

    const sub = this.paymentService.createDirectPayment(request).subscribe({
      next: (response) => {
        this.isCreatingPayment = false;
        this.creatingChannelCode = null;

        if (response.success && response.data) {
          setTimeout(() => {
            this.paymentData = response.data;
            this.currentState = 'payment-details';
            this.cdr.detectChanges();

            // Start polling transaction status
            this.startPollingTransaction(response.data.reference_id);
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to create payment'
          });
          setTimeout(() => {
            this.currentState = 'select-method';
            this.cdr.detectChanges();
          });
        }
      },
      error: (error) => {
        this.isCreatingPayment = false;
        this.creatingChannelCode = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'Failed to create payment'
        });
        setTimeout(() => {
          this.currentState = 'select-method';
          this.cdr.detectChanges();
        });
      }
    });

    this.subscriptions.push(sub);
  }

  startPollingTransaction(referenceId: string): void {
    const sub = this.paymentService.pollTransactionStatus(referenceId).subscribe({
      next: (transaction) => {
        if (transaction && transaction.status === 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payment successful!'
          });

          // Refresh user profile to update applications list
          this.authService.refreshProfile().subscribe({
            next: () => {
              // console.log('Profile refreshed successfully');
            },
            error: (error) => {
              // console.error('Failed to refresh profile:', error);
            }
          });

          // Close dialog and refresh parent
          setTimeout(() => {
            this.ref.close({ success: true, transaction });
          }, 2000);
        } else if (transaction && (transaction.status === 'failed' || transaction.status === 'expired')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Payment Failed',
            detail: `Payment ${transaction.status}`
          });
        }
      },
      error: (error) => {
        console.error('Polling error:', error);
      }
    });

    this.subscriptions.push(sub);
  }

  backToSelectMethod(): void {
    // Show confirmation dialog
    if (this.paymentData) {
      const confirmed = confirm(
        'Apakah Anda yakin ingin mengganti metode pembayaran? Transaksi yang sedang berjalan akan dibatalkan.'
      );

      if (!confirmed) return;

      // Cancel current transaction
      if (this.paymentData.reference_id) {
        this.cancelTransaction(this.paymentData.reference_id);
      }
    }

    setTimeout(() => {
      this.currentState = 'select-method';
      this.selectedChannel = null;
      this.paymentData = null;
      this.cdr.detectChanges();

      // Reload payment methods
      this.loadPaymentMethods();
    });
  }

  cancelTransaction(referenceId: string): void {
    const sub = this.paymentService.cancelTransaction(referenceId).subscribe({
      next: () => {
        // console.log('Transaction cancelled:', referenceId);
      },
      error: (error) => {
        // console.error('Failed to cancel transaction:', error);
      }
    });

    this.subscriptions.push(sub);
  }

  closeDialog(): void {
    this.ref.close();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Copied to clipboard'
      });
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatExpiry(expiredDate: string): string {
    const now = new Date();
    const expiry = new Date(expiredDate);
    const diff = expiry.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (diff <= 0) return '00:00:00';

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  getBankLogo(channel: string): string {
    const logos: { [key: string]: string } = {
      'BCA': 'https://storage.googleapis.com/ipaymu-docs/assets/bca.png',
      'BNI': 'https://storage.googleapis.com/ipaymu-docs/assets/bni.png',
      'BRI': 'https://storage.googleapis.com/ipaymu-docs/assets/bri.png',
      'MANDIRI': 'https://storage.googleapis.com/ipaymu-docs/assets/mandiri.png',
      'CIMB': 'https://storage.googleapis.com/ipaymu-docs/assets/niaga.png',
      'PERMATA': 'https://storage.googleapis.com/ipaymu-docs/assets/permata.png',
      'BSI': 'https://storage.googleapis.com/ipaymu-docs/assets/bsi.png',
      'DANAMON': 'https://storage.googleapis.com/ipaymu-docs/assets/danamon.png',
    };
    return logos[channel.toUpperCase()] || '';
  }
}
