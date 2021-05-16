import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstadisticas } from 'app/models/estadisticas.model';

export type EntityResponseType = HttpResponse<IEstadisticas>;

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/estadisticas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  query(req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstadisticas>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
