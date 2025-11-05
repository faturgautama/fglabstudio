import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/pages/authentication/authentication';
import { TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

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

  _authenticationService = inject(AuthenticationService);

  user = this._authenticationService._userData;

  ngOnInit(): void {
    console.log(this._authenticationService._userData)
  }
}
