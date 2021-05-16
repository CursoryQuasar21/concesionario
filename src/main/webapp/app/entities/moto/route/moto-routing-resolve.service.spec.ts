jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMoto, Moto } from '../moto.model';
import { MotoService } from '../service/moto.service';

import { MotoRoutingResolveService } from './moto-routing-resolve.service';

describe('Service Tests', () => {
  describe('Moto routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MotoRoutingResolveService;
    let service: MotoService;
    let resultMoto: IMoto | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MotoRoutingResolveService);
      service = TestBed.inject(MotoService);
      resultMoto = undefined;
    });

    describe('resolve', () => {
      it('should return IMoto returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMoto).toEqual({ id: 123 });
      });

      it('should return new IMoto if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoto = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMoto).toEqual(new Moto());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMoto).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
