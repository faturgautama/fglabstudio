import { Routes } from '@angular/router';

export const humanResourceRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./login/login')).Login,
        data: {
            title: 'Login'
        }
    },
    {
        path: 'home',
        loadComponent: async () => (await import('./home/home')).Home,
        data: {
            title: 'Home'
        }
    }
];
