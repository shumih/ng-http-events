import { Component } from '@angular/core';
import { HttpEventsService } from '../../projects/ng-http-events/src/lib/ng-http-events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public httpEvents: HttpEventsService) {}
}
