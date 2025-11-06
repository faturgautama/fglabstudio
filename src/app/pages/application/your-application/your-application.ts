import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/pages/authentication/authentication';
import { TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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
export class YourApplication implements OnInit {

  _router = inject(Router);
  _authenticationService = inject(AuthenticationService);

  user = this._authenticationService._userData;

  ngOnInit(): void {
  }

  handleClickApps(url: string) {
    this._router.navigateByUrl(url);
  }
}
