import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/room-finder/room-finder.component').then(c => c.RoomFinderComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/sketch-page/sketch-page.component').then(c => c.SketchPageComponent)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
