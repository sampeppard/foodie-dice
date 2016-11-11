import { Component } from '@angular/core';
import { ListService } from './services/list.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers: [ListService]
})

export class AppComponent { }
