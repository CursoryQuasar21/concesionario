import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMoto, getMotoIdentifier } from '../moto.model';

export type EntityResponseType = HttpResponse<IMoto>;
export type EntityArrayResponseType = HttpResponse<IMoto[]>;

@Injectable({ providedIn: 'root' })
export class MotoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/motos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(moto: IMoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moto);
    return this.http
      .post<IMoto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(moto: IMoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moto);
    return this.http
      .put<IMoto>(`${this.resourceUrl}/${getMotoIdentifier(moto) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(moto: IMoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moto);
    return this.http
      .patch<IMoto>(`${this.resourceUrl}/${getMotoIdentifier(moto) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMoto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMoto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMotoToCollectionIfMissing(motoCollection: IMoto[], ...motosToCheck: (IMoto | null | undefined)[]): IMoto[] {
    const motos: IMoto[] = motosToCheck.filter(isPresent);
    if (motos.length > 0) {
      const motoCollectionIdentifiers = motoCollection.map(motoItem => getMotoIdentifier(motoItem)!);
      const motosToAdd = motos.filter(motoItem => {
        const motoIdentifier = getMotoIdentifier(motoItem);
        if (motoIdentifier == null || motoCollectionIdentifiers.includes(motoIdentifier)) {
          return false;
        }
        motoCollectionIdentifiers.push(motoIdentifier);
        return true;
      });
      return [...motosToAdd, ...motoCollection];
    }
    return motoCollection;
  }

  protected convertDateFromClient(moto: IMoto): IMoto {
    return Object.assign({}, moto, {
      anio: moto.anio?.isValid() ? moto.anio.toJSON() : undefined,
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
      res.body.forEach((moto: IMoto) => {
        moto.anio = moto.anio ? dayjs(moto.anio) : undefined;
      });
    }
    return res;
  }
}
