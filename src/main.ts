import { enableProdMode, isDevMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

async function prepareApp() {
  if (isDevMode()) {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }

  return Promise.resolve();
}

prepareApp().then(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
/*
 */
