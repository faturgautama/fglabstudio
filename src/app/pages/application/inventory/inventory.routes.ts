import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: async () => (await import('./home/home')).Home,
        data: {
            icon: 'pi pi-objects-column',
            title: 'Dashboard',
            description: 'Welcome to Inventory App Code By Xerenity'
        }
    }
];
