import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { StepsModule } from 'primeng/steps';
import { of } from 'rxjs';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-new-institution-page',
  standalone: true,
  imports: [
    StepsModule,
    CardModule,
    ToggleButtonModule,
    TreeSelectModule,
    ButtonModule,
    InputGroupModule,
    NgClass,
    InputTextModule
  ],
  templateUrl: './new-institution-page.component.html',
  styleUrl: './new-institution-page.component.scss'
})
export class NewInstitutionPageComponent {

  get institutionNameAvailable() {
    return of(false);
  }
}
