import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/pages/authentication/authentication';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../app.database';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../services/pages/payment.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentDialog } from '../../../components/payment-dialog/payment-dialog';
import { NewPurchaseDialog } from '../../../components/new-purchase-dialog/new-purchase-dialog';

@Component({
  selector: 'app-your-application',
  standalone: true,
  imports: [
    TranslatePipe,
    UpperCasePipe,
    ButtonModule,
    DatePipe
  ],
  providers: [DialogService],
  templateUrl: './your-application.html',
  styleUrl: './your-application.scss'
})
export class YourApplication implements OnInit {

  _router = inject(Router);
  _authenticationService = inject(AuthenticationService);
  _databaseService = inject(DatabaseService);
  _messageService = inject(MessageService);
  _paymentService = inject(PaymentService);
  _dialogService = inject(DialogService);
  _cdr = inject(ChangeDetectorRef);

  currentYear = new Date().getFullYear();

  loading = false;
  user: any;
  paymentDialogRef: DynamicDialogRef | undefined;
  newPurchaseDialogRef: DynamicDialogRef | undefined;

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("_CXUSER_") as string);

    if (user) {
      this._authenticationService
        .getProfile(user.user.id)
        .subscribe((result) => {
          this.user = result;
          this._cdr.detectChanges();
        });
    }
  }

  handleClickApps(url: string) {
    this._router.navigateByUrl(url);
  }

  handleBuyApp(app: any) {
    // Open payment dialog
    this.paymentDialogRef = this._dialogService.open(PaymentDialog, {
      header: 'Payment',
      width: '30rem',
      showHeader: false,
      maximizable: false,
      resizable: false,
      draggable: false,
      modal: true,
      dismissableMask: false,
      data: {
        userId: this.user.user.id,
        appsId: app.application.id,
        amount: app.application.discount_price || app.application.price,
        notifyUrl: 'https://iiaowuevoznophsmlubp.supabase.co/functions/v1/ipaymu-callback'
      }
    });

    this.paymentDialogRef.onClose.subscribe((result: any) => {
      if (result && result.success) {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment successful! Refreshing your applications...'
        });

        // Refresh user data to get updated applications
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  }

  handleBuyNewApp() {
    // Open new purchase dialog
    this.newPurchaseDialogRef = this._dialogService.open(NewPurchaseDialog, {
      header: 'New Purchase',
      width: '90vw',
      showHeader: false,
      maximizable: false,
      resizable: false,
      draggable: false,
      modal: true,
      dismissableMask: false,
    });
  }

  handleDisableApps(product: any) {
    const expiredAtDateObj = new Date(product.expired_at);
    const currentDateObj = new Date();

    // Normalize to date only (set time to 00:00:00)
    const expiredAtDate = new Date(
      expiredAtDateObj.getFullYear(),
      expiredAtDateObj.getMonth(),
      expiredAtDateObj.getDate()
    );

    const currentDay = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth(),
      currentDateObj.getDate()
    );

    return expiredAtDate.getTime() < currentDay.getTime();
  }

  handleSignOut() {
    this.loading = true;

    this._authenticationService
      .signOut(this.user.user.id)
      .subscribe(async (result: any) => {
        if (result.data.id) {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign Out Successfully' });
          await this._databaseService.switchToUserDatabase(result.data.id);
          localStorage.clear();
          this._authenticationService._userData.next(null);
          this.loading = false;

          setTimeout(() => {
            this._router.navigateByUrl("/login");
          }, 100);
        }
      });
  }
}
