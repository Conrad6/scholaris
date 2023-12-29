import { Routes } from "@angular/router";
import { InstitutionsPageComponent } from "./institutions-page/institutions-page.component";
import { OverviewPageComponent } from "./overview-page/overview-page.component";

export const consoleRoutes: Routes = [
    {
        path: 'institutions', component: InstitutionsPageComponent
    },
    { path: 'overview', component: OverviewPageComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
];