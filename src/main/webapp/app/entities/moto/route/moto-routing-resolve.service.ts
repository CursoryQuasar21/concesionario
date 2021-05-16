import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMoto, Moto } from '../moto.model';
import { MotoService } from '../service/moto.service';

@Injectable({ providedIn: 'root' })
export class MotoRoutingResolveService implements Resolve<IMoto> {
  constructor(protected service: MotoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moto: HttpResponse<Moto>) => {
          if (moto.body) {
            return of(moto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Moto());
  }
}
