import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthLayoutComponent } from './auth/auth-layout/auth-layout.component';

export const routes: Routes = [
    { path: 'auth', component: AuthLayoutComponent, loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes) },
    { path: '', pathMatch: 'full', component: LandingPageComponent },
    { path: '**', component: NotFoundPageComponent }
];
