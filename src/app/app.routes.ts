import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { humanResourceResolver } from './pages/application/human-resource/human-resource.resolver';

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
        path: 'your-apps',
        loadComponent: async () => (await import('../app/pages/application/your-application/your-application')).YourApplication,
        resolve: {
            resolver: humanResourceResolver
        }
    },
    {
        path: 'people',
        loadChildren: async () => (await import('../app/pages/application/human-resource/human-resource.routes')).humanResourceRoutes,
        resolve: {
            resolver: humanResourceResolver
        }
    }
];
