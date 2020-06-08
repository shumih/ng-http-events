import { merge, Observable, ReplaySubject, Subject, timer } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, mapTo, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

// @dynamic
@Injectable({
  providedIn: 'root',
})
export class HttpEventsService implements HttpInterceptor {
  public events$: Observable<HttpRequest<unknown>>;
  public pending$: Observable<boolean>;

  private requestSubject: Subject<HttpRequest<unknown>> = new Subject();
  private eventsSubject: Subject<HttpRequest<unknown>> = new Subject();
  private pendingSubject: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    this.events$ = this.eventsSubject.asObservable();
    this.pending$ = this.pendingSubject.asObservable();
  }

  public static urlEndsWith(text: string) {
    return function (event: HttpRequest<unknown>): boolean {
      const url = HttpEventsService.getUrlPath(event);

      try {
        const textAsUrl = new URL(window.location.origin + text);

        return url.endsWith(textAsUrl.pathname);
      } catch (e) {
        return url.endsWith(text);
      }
    };
  }

  public static getUrlPath(request: HttpRequest<unknown>): string {
    // is IE
    if (!!window.navigator && window.navigator.msSaveBlob) {
      return request.url!;
    }

    return new URL(`${window.location.origin}/${request.urlWithParams}`).pathname;
  }

  public getPending(...filters: Array<(request: HttpRequest<unknown>) => boolean>): Observable<boolean> {
    const pendingRequests: Map<string, HttpRequest<unknown>> = new Map();

    const result$ = merge(
      this.requestSubject.pipe(
        filter(event => filters.some(fn => fn(event))),
        tap(request => {
          pendingRequests.set(HttpEventsService.getUrlPath(request), request);
        }),
        mapTo(true)
      ),
      this.events$.pipe(
        filter(event => filters.some(fn => fn(event))),
        tap(req => pendingRequests.delete(HttpEventsService.getUrlPath(req))),
        map(() => !!pendingRequests.size)
      )
    ).pipe(distinctUntilChanged(), shareReplay(1));

    result$.subscribe();

    return result$;
  }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return timer(0).pipe(
      tap(() => {
        this.pendingSubject.next(true);
        this.requestSubject.next(req);
      }),
      switchMap(() => next.handle(req)),
      finalize(() => {
        this.pendingSubject.next(false);
        this.eventsSubject.next(req);
      })
    );
  }
}
