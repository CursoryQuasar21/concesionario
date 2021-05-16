import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMoto, Moto } from '../moto.model';

import { MotoService } from './moto.service';

describe('Service Tests', () => {
  describe('Moto Service', () => {
    let service: MotoService;
    let httpMock: HttpTestingController;
    let elemDefault: IMoto;
    let expectedResult: IMoto | IMoto[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MotoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        color: 'AAAAAAA',
        modelo: 'AAAAAAA',
        marca: 'AAAAAAA',
        anio: currentDate,
        precio: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            anio: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Moto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            anio: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anio: currentDate,
          },
          returnedFromService
        );

        service.create(new Moto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Moto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            color: 'BBBBBB',
            modelo: 'BBBBBB',
            marca: 'BBBBBB',
            anio: currentDate.format(DATE_TIME_FORMAT),
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anio: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Moto', () => {
        const patchObject = Object.assign(
          {
            color: 'BBBBBB',
            modelo: 'BBBBBB',
            marca: 'BBBBBB',
          },
          new Moto()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            anio: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Moto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            color: 'BBBBBB',
            modelo: 'BBBBBB',
            marca: 'BBBBBB',
            anio: currentDate.format(DATE_TIME_FORMAT),
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            anio: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Moto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMotoToCollectionIfMissing', () => {
        it('should add a Moto to an empty array', () => {
          const moto: IMoto = { id: 123 };
          expectedResult = service.addMotoToCollectionIfMissing([], moto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(moto);
        });

        it('should not add a Moto to an array that contains it', () => {
          const moto: IMoto = { id: 123 };
          const motoCollection: IMoto[] = [
            {
              ...moto,
            },
            { id: 456 },
          ];
          expectedResult = service.addMotoToCollectionIfMissing(motoCollection, moto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Moto to an array that doesn't contain it", () => {
          const moto: IMoto = { id: 123 };
          const motoCollection: IMoto[] = [{ id: 456 }];
          expectedResult = service.addMotoToCollectionIfMissing(motoCollection, moto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(moto);
        });

        it('should add only unique Moto to an array', () => {
          const motoArray: IMoto[] = [{ id: 123 }, { id: 456 }, { id: 57402 }];
          const motoCollection: IMoto[] = [{ id: 123 }];
          expectedResult = service.addMotoToCollectionIfMissing(motoCollection, ...motoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const moto: IMoto = { id: 123 };
          const moto2: IMoto = { id: 456 };
          expectedResult = service.addMotoToCollectionIfMissing([], moto, moto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(moto);
          expect(expectedResult).toContain(moto2);
        });

        it('should accept null and undefined values', () => {
          const moto: IMoto = { id: 123 };
          expectedResult = service.addMotoToCollectionIfMissing([], null, moto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(moto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
