// subscription.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/pages/authentication/authentication';
import { MessageService } from 'primeng/api';

export const SubscriptionGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const messageService = inject(MessageService);

    const userData = authService._userData.value;

    // Get required app URL from route data
    const requiredAppUrl = route.data['appUrl'];

    if (!userData || !userData.applications) {
        router.navigate(['/login']);
        return false;
    }

    // Find if user has access to this app
    const userApp = userData.applications.find((app: any) => {
        return app.application.url === requiredAppUrl;
    });

    // User doesn't have this app
    if (!userApp) {
        messageService.add({
            severity: 'warn',
            summary: 'Access Denied',
            detail: 'You don\'t have access to this application. Please purchase it first.'
        });
        router.navigate(['/your-apps']);
        return false;
    }

    const expiredAtDateObj = new Date(userApp.expired_at);
    const currentDateObj = new Date();


    // Check if subscription expired
    const expiredAtDate = new Date(
        expiredAtDateObj.getFullYear(),
        expiredAtDateObj.getMonth(),
        expiredAtDateObj.getDate()
    );

    const currentDay = new Date(
        currentDateObj.getFullYear(),
        currentDateObj.getMonth(),
        currentDateObj.getDate()
    );

    const isExpired = expiredAtDate.getTime() < currentDay.getTime();

    if (userApp.is_trial && isExpired) {
        messageService.add({
            severity: 'error',
            summary: 'Subscription Expired',
            detail: 'Your subscription has expired. Please renew to continue using this application.'
        });
        router.navigate(['/your-apps']);
        return false;
    }

    return true;
};
