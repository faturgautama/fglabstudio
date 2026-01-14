import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Product } from '../../services/components/product';
import { AuthenticationService } from '../../services/pages/authentication/authentication';
import { CardProductModel } from '../../model/components/card-product.model';
import { PaymentDialog } from '../payment-dialog/payment-dialog';
import { Subscription } from 'rxjs';

type DialogState = 'loading' | 'select-product' | 'error';

@Component({
  selector: 'app-new-purchase-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  providers: [DialogService],
  templateUrl: './new-purchase-dialog.html',
  styleUrl: './new-purchase-dialog.scss',
})
export class NewPurchaseDialog implements OnInit, OnDestroy {
  private productService = inject(Product);
  private authService = inject(AuthenticationService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  // Dialog state
  currentState: DialogState = 'loading';

  // Products data
  availableProducts: CardProductModel.ICardProduct[] = [];
  purchasedAppIds: number[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private paymentDialogRef: DynamicDialogRef | undefined;

  // User data
  userId: number = 0;

  ngOnInit(): void {
    // Get user data
    const userData = this.authService._userData.value;
    if (userData && userData.user) {
      this.userId = userData.user.id;

      // Get purchased app IDs
      if (userData.applications && userData.applications.length > 0) {
        this.purchasedAppIds = userData.applications.map((app: any) => app.apps_id);
      }

      this.loadProducts();
    } else {
      this.currentState = 'error';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User data not found'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.paymentDialogRef) {
      this.paymentDialogRef.close();
    }
  }

  loadProducts(): void {
    this.currentState = 'loading';
    this.cdr.detectChanges();

    const sub = this.productService.getProduct().subscribe({
      next: (products) => {
        // Filter out already purchased products
        this.availableProducts = products.filter(product =>
          !this.purchasedAppIds.includes(product.id)
        );

        if (this.availableProducts.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Anda sudah membeli semua aplikasi yang tersedia'
          });
          setTimeout(() => {
            this.ref.close();
          }, 2000);
        } else {
          this.currentState = 'select-product';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.currentState = 'error';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
      }
    });

    this.subscriptions.push(sub);
  }

  selectProduct(product: CardProductModel.ICardProduct): void {
    // Open payment dialog
    this.paymentDialogRef = this.dialogService.open(PaymentDialog, {
      header: 'Payment',
      width: '30rem',
      showHeader: false,
      maximizable: false,
      resizable: false,
      draggable: false,
      modal: true,
      dismissableMask: false,
      data: {
        userId: this.userId,
        appsId: product.id,
        amount: product.discount_price || product.price,
        notifyUrl: 'https://iiaowuevoznophsmlubp.supabase.co/functions/v1/ipaymu-callback'
      }
    });

    this.paymentDialogRef.onClose.subscribe((result: any) => {
      if (result && result.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment successful! Refreshing your applications...'
        });

        // Refresh user data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  }

  closeDialog(): void {
    this.ref.close();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
