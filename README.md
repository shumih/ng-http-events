# NgHttpEvents

The library is an angular interceptor service

## Install

To install the package run:

```bash
npm i ng-print-pdf
```

## Usage

provide service as Angular Interceptor in root module

```typescript
@NgModule({
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
```

and inject HttpEventsService wherever you want:

```typescript
export class AppComponent {
  public isWeatherRequestPending$ = this.httpEvents.getPending(HttpEventsService.urlEndsWith('/weather'));
  public isCityInfoUpdateRequestPending$ = this.httpEvents.getPending(
    req => req.method === 'PUT' && HttpEventsService.urlEndsWith('/city')(req)
  );

  constructor(private httpEvents: HttpEventsService) {}
}
```
