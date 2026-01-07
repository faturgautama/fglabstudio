import { Component, effect, EventEmitter, OnInit, Output } from '@angular/core';
import { NavbarModel } from '../../model/components/navbar.model';
import { Navigation } from '../../services/components/navigation';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Route, Router, UrlSegment } from '@angular/router';

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

  isUrlProductDetail = false;

  @Output() onClick = new EventEmitter<any>();

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _navigationService: Navigation
  ) {
    this.NavbarMenu = this._navigationService.NavbarMenu();

    effect(() => {
      this.isMobile = this._navigationService.isMobile();
    })
  }

  ngOnInit(): void {
    this._activatedRoute
      .url
      .subscribe((url: UrlSegment[]) => {
        if (url.length) {
          this.activeMenu = 'product';
          this.isUrlProductDetail = true;
        } else {
          this.activeMenu = 'home';
          this.isUrlProductDetail = false;
        }
      })
  }

  handleClickMenu(args: NavbarModel.INavbarMenu) {
    if (this.isUrlProductDetail) {
      this._router.navigateByUrl("/");

      setTimeout(() => {
        if (this.isMobile) {
          this.showDrawer = false;
          setTimeout(() => {
            this.activeMenu = args.id;
            this.handleClickNavbarAtProductDetail(args);
          }, 500);
        };

        if (!this.isMobile) {
          this.activeMenu = args.id;
          this.handleClickNavbarAtProductDetail(args);
        }
      }, 750);
    }

    if (!this.isUrlProductDetail) {
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
  }

  handleClickButton(id: string) {
    if (id == 'login') {
      this._router.navigateByUrl("/login");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = element!.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  private handleClickNavbarAtProductDetail(args: NavbarModel.INavbarMenu) {
    const element = document.getElementById(args.id);
    if (element) {
      const offset = element!.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
}
