import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dsh-navbar-db-action',
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
  ],
  standalone: true,
  templateUrl: './dsh-navbar-db-action.html',
  styleUrl: './dsh-navbar-db-action.scss',
})
export class DshNavbarDbAction {

  _showModal = false;


}
