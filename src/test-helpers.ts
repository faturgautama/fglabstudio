import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

/**
 * Mock TranslateLoader for testing
 */
export class FakeTranslateLoader implements TranslateLoader {
    getTranslation() {
        return of({});
    }
}

/**
 * Common test providers for Angular tests
 */
export const commonTestProviders = [
    provideHttpClient(),
    provideStore([]),
    provideRouter([]),
];

/**
 * Common test imports for Angular tests
 */
export const commonTestImports = [
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useClass: FakeTranslateLoader
        }
    })
];
