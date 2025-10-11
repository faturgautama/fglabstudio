import { computed, effect, Injectable, OnDestroy, signal } from '@angular/core';
import { NavbarModel } from '../../model/components/navbar.model';
import { BehaviorSubject, debounceTime, fromEvent } from 'rxjs';
import { SidebarModel } from '../../model/components/dashboard/sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class Navigation implements OnDestroy {
  private _navbarMenu = signal<NavbarModel.INavbarMenu[]>([]);
  NavbarMenu = computed(() => this._navbarMenu());

  private readonly MOBILE_BREAKPOINT = 768;
  private resizeSubscription?: any;
  private windowWidth = signal<number>(this.getCurrentWindowWidth());
  readonly isMobile = computed(() => this.windowWidth() < this.MOBILE_BREAKPOINT);

  toggleDashboardSidebar = new BehaviorSubject(false);
  private _sidebarDashboardMenu = signal<SidebarModel.ISidebar[]>([]);
  SidebarDashboardMenu = computed(() => this._sidebarDashboardMenu());

  constructor() {
    effect(() => {
      const menu = this._navbarMenu();
      if (menu.length > 0) {
        localStorage.setItem("_FLSNM_", JSON.stringify(menu));
      }
    });

    this.loadNavbarMenuFromStorage();
    this.initializeResizeListener();
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  setNavbarMenu(menu: NavbarModel.INavbarMenu[]) {
    this._navbarMenu.set(menu);
  }

  private loadNavbarMenuFromStorage() {
    try {
      const storedMenu = localStorage.getItem("_FLSNM_");
      if (storedMenu) {
        const menu: NavbarModel.INavbarMenu[] = JSON.parse(storedMenu);
        this._navbarMenu.set(menu);
      }
    } catch (error) {
      console.error('Error loading navbar menu from localStorage:', error);
    }
  }

  private getCurrentWindowWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 0;
  }

  private initializeResizeListener(): void {
    if (typeof window === 'undefined') return;

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.windowWidth.set(this.getCurrentWindowWidth());
      });
  }

  setSidebarDashboardMenu(menu: SidebarModel.ISidebar[]) {
    this._sidebarDashboardMenu.set(menu);
  }
}
