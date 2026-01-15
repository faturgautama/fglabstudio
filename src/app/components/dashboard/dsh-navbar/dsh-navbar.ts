import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DshNavbarSearch } from '../dsh-navbar-search/dsh-navbar-search';
import { DshNavbarDbAction } from "../dsh-navbar-db-action/dsh-navbar-db-action";
import { AuthenticationService } from '../../../services/pages/authentication/authentication';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportService } from '../../../services/shared/viewport.service';
import { DshSidebar } from '../dsh-sidebar/dsh-sidebar';

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
    DshNavbarDbAction,
    AsyncPipe,
    DatePipe
  ],
  standalone: true,
  templateUrl: './dsh-navbar.html',
  styleUrl: './dsh-navbar.scss'
})
export class DshNavbar {

  @ViewChild('navbarSearchModal') navbarSearchModal!: DshNavbarSearch;

  @ViewChild('navbarDbAction') navbarDbAction!: DshNavbarDbAction;

  private _authService = inject(AuthenticationService);
  private _router = inject(Router);
  private _viewportService = inject(ViewportService);

  isMobile = this._viewportService.isMobile;

  // Reference to sidebar for mobile toggle
  sidebarRef?: DshSidebar;

  userData = this._authService._userData
    .pipe(
      map((result) => {
        const currentApplication = result.applications.filter((item: any) => {
          if (this._router.url.includes(item.application.url)) {
            return item;
          }
        });

        return {
          ...result,
          current_application: currentApplication.length ? currentApplication[0] : null
        };
      })
    );

  setSidebarRef(sidebar: DshSidebar) {
    this.sidebarRef = sidebar;
  }

  handleToggleMobileSidebar() {
    if (this.sidebarRef) {
      this.sidebarRef.handleToggleSidebar();
    }
  }

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
