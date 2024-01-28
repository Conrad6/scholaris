import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Account, Client } from 'appwrite';
import { catchError, from, map, of } from 'rxjs';
import { UserStateModel } from '../../models';

export const signedInGuard: (redirectTo: string) => CanActivateFn = (redirectTo: string) => (route, state) => {
  const router = inject(Router);
  const userState = inject(Store).selectSnapshot<UserStateModel>(state => state.user);

  return userState.session ? true : router.createUrlTree([redirectTo], {
    queryParamsHandling: 'merge',
    queryParams: {
      continue: encodeURIComponent(state.url)
    }
  });
};
