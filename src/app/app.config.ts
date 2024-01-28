import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NavigationActionTiming, NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { Client } from 'appwrite';
import { routes } from './app.routes';
import { UserState } from './state/user.state';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: Client, useValue: new Client().setEndpoint('https://api.scholaris.space/v1').setProject('6586b572b4b54e7b58b7')
    },
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    importProvidersFrom([
      NgxsModule.forRoot([UserState]),
      NgxsLoggerPluginModule.forRoot({ disabled: !isDevMode() }),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: !isDevMode() }),
      NgxsStoragePluginModule.forRoot({
        storage: StorageOption.LocalStorage
      }),
      NgxsRouterPluginModule.forRoot({ navigationActionTiming: NavigationActionTiming.PreActivation })
    ])
  ]
};
