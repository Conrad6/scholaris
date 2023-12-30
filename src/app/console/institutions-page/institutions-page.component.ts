import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-institutions-page',
  standalone: true,
  imports: [
    DataViewModule,
    TooltipModule,
    RouterLink,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToolbarModule,
    ButtonModule
  ],
  templateUrl: './institutions-page.component.html',
  styleUrl: './institutions-page.component.scss'
})
export class InstitutionsPageComponent {

}
