import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { humanResourceResolver } from './pages/application/human-resource/human-resource.resolver';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'people',
        loadChildren: async () => (await import('../app/pages/application/human-resource/human-resource.routes')).humanResourceRoutes,
        resolve: {
            resolver: humanResourceResolver
        }
    }
];
