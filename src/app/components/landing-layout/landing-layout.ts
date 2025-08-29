import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Footer } from '../footer/footer';
import { NavbarModel } from '../../model/components/navbar.model';
import { Navigation } from '../../services/components/navigation';

@Component({
  selector: 'app-landing-layout',
  imports: [
    CommonModule,
    Navbar,
    Footer
  ],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.scss',
  standalone: true
})
export class LandingLayout implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  NavbarMenu: NavbarModel.INavbarMenu[];

  constructor(
    private _navigationService: Navigation
  ) {
    this.NavbarMenu = [
      { id: 'home', menu: 'NAVBAR.Home', url: '/', active: true },
      { id: 'product', menu: 'NAVBAR.Product', url: '/product', active: false },
      { id: 'service', menu: 'NAVBAR.Service', url: '/service', active: false },
      { id: 'about_us', menu: 'NAVBAR.AboutUs', url: '/about-us', active: false },
      { id: 'faq', menu: 'NAVBAR.FAQ', url: '/faq', active: false },
    ];

    this._navigationService.setNavbarMenu(this.NavbarMenu);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }
}
