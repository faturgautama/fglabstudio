import { Component, effect, EventEmitter, OnInit, Output } from '@angular/core';
import { NavbarModel } from '../../model/components/navbar.model';
import { Navigation } from '../../services/components/navigation';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TranslatePipe } from '@ngx-translate/core';

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

  activeMenu = "home";

  @Output('onClick') onClick = new EventEmitter<any>();

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

  handleClickMenu(args: NavbarModel.INavbarMenu) {
    if (this.isMobile) {
      this.showDrawer = false;
      setTimeout(() => {
        this.activeMenu = args.id;
        this.onClick.emit(args);
      }, 500);
    };

    if (!this.isMobile) {
      this.activeMenu = args.id;
      this.onClick.emit(args);
    }
  }

  handleClickButton(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = element!.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
}
