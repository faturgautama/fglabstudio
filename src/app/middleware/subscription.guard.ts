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

    // Check if subscription expired
    const isExpired = new Date() > new Date(userApp.expired_at);

    if (isExpired) {
        messageService.add({
            severity: 'error',
            summary: 'Subscription Expired',
            detail: 'Your subscription has expired. Please renew to continue using this application.'
        });
        router.navigate(['/your-apps']);
        return false;
    }

    // Check if trial and show info
    if (userApp.is_trial) {
        const daysLeft = Math.ceil((new Date(userApp.expired_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 3) {
            messageService.add({
                severity: 'info',
                summary: 'Trial Ending Soon',
                detail: `Your trial will expire in ${daysLeft} day(s). Upgrade now to continue using this app.`,
                life: 5000
            });
        }
    }

    return true;
};
