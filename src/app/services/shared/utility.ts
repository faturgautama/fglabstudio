import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, MonoTypeOperatorFunction } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    _showDashboardLoading = new BehaviorSubject(false);

    /** Automatically toggle loading before and after an observable */
    withLoading(delayMs: number = 0): MonoTypeOperatorFunction<any> {
        this._showDashboardLoading.next(true);
        return finalize(() => {
            setTimeout(() => this._showDashboardLoading.next(false), delayMs);
        });
    }
}
