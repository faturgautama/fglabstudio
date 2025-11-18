import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DshNavbarSearch } from '../dsh-navbar-search/dsh-navbar-search';
import { DshNavbarDbAction } from "../dsh-navbar-db-action/dsh-navbar-db-action";

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
    DshNavbarDbAction
  ],
  standalone: true,
  templateUrl: './dsh-navbar.html',
  styleUrl: './dsh-navbar.scss'
})
export class DshNavbar {

  @ViewChild('navbarSearchModal') navbarSearchModal!: DshNavbarSearch;

  @ViewChild('navbarDbAction') navbarDbAction!: DshNavbarDbAction;

  constructor() { }

  openSearchModal() {
    this.navbarSearchModal._showModal = true;
  }

  handleDownloadDatabase() {
    this.navbarDbAction._showModal = true;
  }

  handleNavigateToYourApps() {
    window.location.href = '/your-apps';
  }
}
