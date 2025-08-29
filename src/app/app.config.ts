import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: 'none',
                }
            }
        }),
        provideHttpClient(),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideStore(),
        provideEffects(),
        provideTranslateService({
            lang: 'en',
            fallbackLang: 'en',
            loader: provideTranslateHttpLoader({
                prefix: '/assets/i18n/',
                suffix: '.json'
            })
        }),
        provideAppInitializer(() => {
            const translate = inject(TranslateService);
            translate.use(translate.getBrowserLang() || "en");
        })
    ]
};
