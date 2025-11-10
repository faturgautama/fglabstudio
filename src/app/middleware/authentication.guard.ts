// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/pages/authentication/authentication';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (authService._userData) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};
