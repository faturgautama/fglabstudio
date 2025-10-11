import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Navigation } from '../../../services/components/navigation';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';

@Component({
  selector: 'app-dsh-sidebar',
  imports: [
    ButtonModule,
  ],
  standalone: true,
  templateUrl: './dsh-sidebar.html',
  styleUrl: './dsh-sidebar.scss'
})
export class DshSidebar implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  _navigationService = inject(Navigation);

  toggleSidebar = false;

  sidebarMenu: SidebarModel.ISidebar[] = this._navigationService.SidebarDashboardMenu();

  constructor() {
    this._navigationService
      .toggleDashboardSidebar
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        this.toggleSidebar = result;
      })
  }

  ngOnInit(): void {
    const menu = this._navigationService.SidebarDashboardMenu();
    console.log("menu =>", menu);
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleToggleSidebar() {
    const currentState = this._navigationService.toggleDashboardSidebar.value;
    this._navigationService.toggleDashboardSidebar.next(!currentState);
  }
}
