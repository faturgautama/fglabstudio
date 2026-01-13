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

  user: any;
  paymentDialogRef: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this._authenticationService
      ._userData
      .subscribe((result) => {
        this.user = result;
        this._cdr.detectChanges();

        console.log("user =>", this.user);
      });
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

  handleDisableApps(expired_at: string) {
    return new Date().getTime() > new Date(expired_at).getTime();
  }

  handleSignOut() {
    this._authenticationService
      .signOut(this.user.user.id)
      .subscribe(async (result: any) => {
        if (result.data.id) {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign Out Successfully' });
          await this._databaseService.switchToUserDatabase(result.data.id);
          localStorage.clear();
          this._authenticationService._userData.next(null);

          setTimeout(() => {
            this._router.navigateByUrl("/login");
          }, 100);
        }
      });
  }
}
