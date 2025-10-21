import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dsh-navbar',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './dsh-navbar.html',
  styleUrl: './dsh-navbar.scss'
})
export class DshNavbar {

  constructor() { }

}
