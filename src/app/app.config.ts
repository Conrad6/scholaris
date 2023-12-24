import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { getApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { initializeApp } from '@angular/fire/app';
import { browserSessionPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NavigationActionTiming, NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { UserState } from './state/user.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyAGYm49si_pjgDMnWV3w6UidRic0xs-FwM",
        authDomain: "scholaris2-c7e7b.firebaseapp.com",
        projectId: "scholaris2-c7e7b",
        storageBucket: "scholaris2-c7e7b.appspot.com",
        messagingSenderId: "471420809173",
        appId: "1:471420809173:web:38c1120413e976d7dfd75c"
      })),
      provideAuth(() => initializeAuth(getApp(), {
        persistence: browserSessionPersistence,
      })),
      NgxsModule.forRoot([UserState]),
      NgxsLoggerPluginModule.forRoot({ disabled: !isDevMode() }),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: !isDevMode() }),
      NgxsStoragePluginModule.forRoot({
        storage: StorageOption.LocalStorage
      }),
      NgxsRouterPluginModule.forRoot({ navigationActionTiming: NavigationActionTiming.PostActivation })
    ])
  ]
};
