import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/pages/authentication/authentication';
import { TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../app.database';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-your-application',
  standalone: true,
  imports: [
    TranslatePipe,
    UpperCasePipe,
    ButtonModule,
  ],
  templateUrl: './your-application.html',
  styleUrl: './your-application.scss'
})
export class YourApplication implements AfterViewInit, OnInit {

  _router = inject(Router);
  _authenticationService = inject(AuthenticationService);
  _databaseService = inject(DatabaseService);
  _messageService = inject(MessageService);
  _cdr = inject(ChangeDetectorRef);

  user: any;

  ngOnInit(): void {
    this._authenticationService
      ._userData
      .subscribe((result) => {
        this.user = result;
        this._cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

    }, 100);
  }

  handleClickApps(url: string) {
    this._router.navigateByUrl(url);
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
