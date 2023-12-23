import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp } from '@angular/fire/app';

import { routes } from './app.routes';
import { initializeApp } from '@firebase/app';

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
      }))
    ])
  ]
};
