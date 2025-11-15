import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DshNavbarSearch } from '../dsh-navbar-search/dsh-navbar-search';

@Component({
  selector: 'app-dsh-navbar',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TooltipModule,
    DshNavbarSearch,
  ],
  standalone: true,
  templateUrl: './dsh-navbar.html',
  styleUrl: './dsh-navbar.scss'
})
export class DshNavbar {

  @ViewChild('navbarSearchModal') navbarSearchModal!: DshNavbarSearch;

  constructor() { }

  openSearchModal() {
    console.log(this.navbarSearchModal)
    this.navbarSearchModal._showModal = true;
  }

}
