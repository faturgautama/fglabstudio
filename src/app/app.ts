import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import AOS from 'aos';
import { AuthenticationService } from './services/pages/authentication/authentication';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('fglabstudio');

  private _authService = inject(AuthenticationService);
  private _router = inject(Router);
  private _destroy$ = new Subject<void>();

  ngOnInit() {
    AOS.init();
    this.checkUserLoginDate();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Check if user's last login is from a different date
   * If yes, force sign out
   */
  private checkUserLoginDate(): void {
    this._authService._userData
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          if (result?.user?.last_login) {
            if (this.isDifferentDate(new Date(result.user.last_login))) {
              this.forceSignOut(result.user.id);
            }
          }
        }
      });
  }

  /**
   * Compare dates (date only, ignore time)
   * @returns true if lastLogin date is before current date
   */
  private isDifferentDate(lastLogin: string | Date, currentDate: string | Date = new Date()): boolean {
    const lastLoginDate = new Date(lastLogin);
    const currentDateObj = new Date(currentDate);

    // Normalize to date only (set time to 00:00:00)
    const lastLoginDay = new Date(
      lastLoginDate.getFullYear(),
      lastLoginDate.getMonth(),
      lastLoginDate.getDate()
    );
    const currentDay = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth(),
      currentDateObj.getDate()
    );

    return lastLoginDay.getTime() < currentDay.getTime();
  }

  /**
   * Force sign out user and clear local storage
   */
  private forceSignOut(user_id: number): void {
    this._authService
      .signOut(user_id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            localStorage.clear();

            // Navigate to home if not already there
            if (this._router.url !== '/') {
              this._router.navigate(['/']);
            }
          }
        },
        error: (error) => {
          console.error('Error during force sign out:', error);
          // Force clear localStorage even if API fails
          localStorage.clear();
          this._router.navigate(['/']);
        }
      });
  }
}