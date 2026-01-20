import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { humanResourceResolver } from './pages/application/human-resource/human-resource.resolver';
import { AuthGuard } from './middleware/authentication.guard';
import { SubscriptionGuard } from './middleware/subscription.guard';
import { inventoryResolver } from './pages/application/inventory/inventory.resolver';
import { posResolver } from './pages/application/point-of-sales/pos.resolver';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        loadComponent: async () => (await import('../app/pages/application/authentication/authentication')).Authentication,
        resolve: {
            resolver: humanResourceResolver
        }
    },
    {
        path: 'register',
        loadComponent: async () => (await import('../app/pages/register/register')).Register
    },
    {
        path: 'your-apps',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('../app/pages/application/your-application/your-application')).YourApplication,
        resolve: {
            resolver: humanResourceResolver
        }
    },
    {
        path: 'people',
        canActivate: [AuthGuard, SubscriptionGuard],
        data: { appUrl: '/people' },
        loadChildren: async () => (await import('../app/pages/application/human-resource/human-resource.routes')).humanResourceRoutes,
        resolve: {
            resolver: humanResourceResolver
        }
    },
    {
        path: 'inventory',
        canActivate: [AuthGuard, SubscriptionGuard],
        data: { appUrl: '/inventory' },
        loadChildren: async () => (await import('../app/pages/application/inventory/inventory.routes')).inventoryRoutes,
        resolve: {
            resolver: inventoryResolver
        }
    },
    {
        path: 'point-of-sales',
        canActivate: [AuthGuard, SubscriptionGuard],
        data: { appUrl: '/point-of-sales' },
        loadChildren: async () => (await import('../app/pages/application/point-of-sales/pos.routes')).posRoutes,
        resolve: {
            resolver: posResolver
        }
    },
    {
        path: 'product',
        loadComponent: async () => (await import('../app/pages/product-detail/product-detail')).ProductDetail
    },
    {
        path: 'service',
        loadComponent: async () => (await import('../app/pages/service-detail/service-detail')).ServiceDetail
    },
    {
        path: 'terms-and-conditions',
        loadComponent: async () => (await import('../app/pages/terms-and-conditions/terms-and-conditions')).TermsAndConditions
    },
    {
        path: 'refund-policy',
        loadComponent: async () => (await import('../app/pages/refund-policy/refund-policy')).RefundPolicy
    }
];
