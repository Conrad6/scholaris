import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Navigate, RouterCancel, RouterError, RouterNavigated, RouterNavigation } from '@ngxs/router-plugin';
import { Actions, Select, Store, ofActionDispatched, ofActionSuccessful } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable, map } from 'rxjs';
import { UserStateModel } from '../../../models';
import { SignOut } from '../../state/actions/user.actions';

@Component({
  selector: 'app-root-page',
  standalone: true,
  imports: [
    TabMenuModule,
    NgClass,
    MenuModule,
    RouterOutlet,
    ProgressSpinnerModule,
    BadgeModule,
    ToolbarModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    ButtonModule
  ],
  templateUrl: './root-page.component.html',
  styleUrl: './root-page.component.scss'
})
export class RootPageComponent {
  @Select() private readonly user$!: Observable<UserStateModel>;
  private readonly store = inject(Store);
  navigating = signal(false);

  constructor() {
    const actions = inject(Actions);
    actions.pipe(
      takeUntilDestroyed(),
      ofActionDispatched(RouterNavigation)
    ).subscribe(() => {
      this.navigating.set(true);
    });

    actions.pipe(
      takeUntilDestroyed(),
      ofActionSuccessful(RouterNavigated, RouterError, RouterCancel)
    ).subscribe(() => {
      this.navigating.set(false);
    });
  }

  user = toSignal(
    this.user$.pipe(
      map(model => model.principal)
    )
  );

  logo = toSignal(
    this.user$.pipe(
      map(model => model.logo)
    )
  );

  readonly subRoutes: MenuItem[] = [
    {
      icon: 'pi pi-th-large',
      label: 'Overview',
      routerLink: ['overview']
    },
    {
      icon: 'pi pi-building',
      label: 'Institutions',
      routerLink: ['institutions']
    }
  ];

  activeItem = this.subRoutes[0];

  readonly accountItems: MenuItem[] = [
    {
      icon: 'pi pi-user',
      label: 'Account',
      routerLink: ['/profile'],
      queryParamsHandling: 'preserve'
    },
    {
      icon: 'pi pi-user',
      label: 'Sign out',
      command: () => {
        this.store.dispatch(SignOut).subscribe({
          complete: () => {
            this.store.dispatch(new Navigate(['/']));
          },
        })
      }
    }
  ]
}
