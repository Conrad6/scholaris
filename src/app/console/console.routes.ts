import { Routes } from "@angular/router";
import { InstitutionsPageComponent } from "./institutions-page/institutions-page.component";
import { NewInstitutionPageComponent } from "./new-institution-page/new-institution-page.component";
import { OverviewPageComponent } from "./overview-page/overview-page.component";

export const consoleRoutes: Routes = [
    {
        path: 'institutions', component: InstitutionsPageComponent, children: [
        ]
    },
    { path: 'institutions/new', title: 'New Institution', component: NewInstitutionPageComponent },
    { path: 'overview', component: OverviewPageComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
];