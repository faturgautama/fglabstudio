import { Routes } from '@angular/router';

export const humanResourceRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./login/login')).Login,
    },
    {
        path: 'home',
        loadComponent: async () => (await import('./home/home')).Home,
        data: {
            icon: 'pi pi-objects-column',
            title: 'Dashboard',
            description: 'Welcome to People HR App Code By Xerenity'
        }
    },
    {
        path: 'position',
        loadComponent: async () => (await import('./position/position')).Position,
        data: {
            icon: 'pi pi-at',
            title: 'Posisi Jabatan',
            description: 'Manage dan atur semua posisi jabatan'
        }
    },
    {
        path: 'departement',
        loadComponent: async () => (await import('./departement/departement')).Departement,
        data: {
            icon: 'pi pi-users',
            title: 'Departement',
            description: 'Manage dan atur semua departemen'
        }
    }
];
