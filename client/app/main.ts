import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule)
    .then(success => console.log('bootstrap success'))
    .catch(error => console.log(error));
