import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICoche, getCocheIdentifier } from '../coche.model';

export type EntityResponseType = HttpResponse<ICoche>;
export type EntityArrayResponseType = HttpResponse<ICoche[]>;

@Injectable({ providedIn: 'root' })
export class CocheService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/coches');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(coche: ICoche): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coche);
    return this.http
      .post<ICoche>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(coche: ICoche): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coche);
    return this.http
      .put<ICoche>(`${this.resourceUrl}/${getCocheIdentifier(coche) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(coche: ICoche): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(coche);
    return this.http
      .patch<ICoche>(`${this.resourceUrl}/${getCocheIdentifier(coche) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICoche>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICoche[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCocheToCollectionIfMissing(cocheCollection: ICoche[], ...cochesToCheck: (ICoche | null | undefined)[]): ICoche[] {
    const coches: ICoche[] = cochesToCheck.filter(isPresent);
    if (coches.length > 0) {
      const cocheCollectionIdentifiers = cocheCollection.map(cocheItem => getCocheIdentifier(cocheItem)!);
      const cochesToAdd = coches.filter(cocheItem => {
        const cocheIdentifier = getCocheIdentifier(cocheItem);
        if (cocheIdentifier == null || cocheCollectionIdentifiers.includes(cocheIdentifier)) {
          return false;
        }
        cocheCollectionIdentifiers.push(cocheIdentifier);
        return true;
      });
      return [...cochesToAdd, ...cocheCollection];
    }
    return cocheCollection;
  }

  protected convertDateFromClient(coche: ICoche): ICoche {
    return Object.assign({}, coche, {
      anio: coche.anio?.isValid() ? coche.anio.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.anio = res.body.anio ? dayjs(res.body.anio) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((coche: ICoche) => {
        coche.anio = coche.anio ? dayjs(coche.anio) : undefined;
      });
    }
    return res;
  }
}
