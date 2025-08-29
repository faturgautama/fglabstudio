import { Component, effect, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavbarModel } from '../../model/components/navbar.model';
import { Navigation } from '../../services/components/navigation';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [
    ButtonModule,
    DrawerModule,
    TranslatePipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true
})
export class Navbar implements OnInit {

  isMobile = false;

  NavbarMenu: NavbarModel.INavbarMenu[];

  showDrawer = false;

  constructor(
    private _navigationService: Navigation
  ) {
    this.NavbarMenu = this._navigationService.NavbarMenu();

    effect(() => {
      this.isMobile = this._navigationService.isMobile();
    })
  }

  ngOnInit(): void {

  }
}
