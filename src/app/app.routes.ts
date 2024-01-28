import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthLayoutComponent } from './auth/auth-layout/auth-layout.component';
import { RootPageComponent } from './console/root-page/root-page.component';
import { signedInGuard } from './guards/signed-in.guard';

export const routes: Routes = [
    { path: 'auth', component: AuthLayoutComponent, loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes) },
    { path: 'console', component: RootPageComponent, canActivate: [signedInGuard('/auth/login')], loadChildren: () => import('./console/console.routes').then(m => m.consoleRoutes) },
    { path: '', pathMatch: 'full', component: LandingPageComponent },
    { path: '**', component: NotFoundPageComponent }
];
