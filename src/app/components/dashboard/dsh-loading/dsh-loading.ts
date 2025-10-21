import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { DialogModule } from "primeng/dialog";
import { UtilityService } from '../../../services/shared/utility';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dsh-loading',
  imports: [
    DialogModule
  ],
  standalone: true,
  templateUrl: './dsh-loading.html',
  styleUrl: './dsh-loading.scss'
})
export class DshLoading implements OnDestroy {
  Destroy$ = new Subject();

  _showLoading = false;

  _utilityService = inject(UtilityService);

  constructor(
    private _cdr: ChangeDetectorRef,
  ) {
    this._utilityService
      ._showDashboardLoading
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        this._showLoading = result;
        setTimeout(() => this._cdr.detectChanges(), 0);
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }
}
