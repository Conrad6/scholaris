import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppwriteException } from 'appwrite';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewLazyLoadEvent, DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Institution } from '../../../models';
import { InstitutionService } from '../../state/services/institution.service';

@Component({
  selector: 'app-institutions-page',
  standalone: true,
  providers: [MessageService],
  imports: [
    ToastModule,
    NgClass,
    DataViewModule,
    TooltipModule,
    RouterLink,
    CardModule,
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
  layout = signal<'grid' | 'list'>('list');
  readonly institutions = signal<Institution[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);
  readonly keySelectorFn = (i: Institution) => i.$id;

  private institutionService = inject(InstitutionService);
  private toastService = inject(MessageService)

  onLayoutChanged() {
    this.layout.update(val => val == 'grid' ? 'list' : 'grid');
  }

  onDataViewLazyLoad({ first, rows, sortField, sortOrder }: DataViewLazyLoadEvent) {
    this.loading.set(true);
    this.institutionService.getInstitutions(Math.floor(first / rows), rows).subscribe({
      next: ({ total, documents }) => {
        this.totalRecords.set(total);
        this.institutions.set(documents);
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (error: AppwriteException) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
        this.loading.set(false);
      }
    });
  }

  onDataViewPageChanged(event: DataViewPageEvent) {

  }
}
