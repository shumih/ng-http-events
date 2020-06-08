import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpEventsService } from '../../projects/ng-http-events/src/lib/ng-http-events.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpEventsService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
