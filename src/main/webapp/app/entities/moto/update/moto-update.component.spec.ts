jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MotoService } from '../service/moto.service';
import { IMoto, Moto } from '../moto.model';
import { IVenta } from 'app/entities/venta/venta.model';
import { VentaService } from 'app/entities/venta/service/venta.service';

import { MotoUpdateComponent } from './moto-update.component';

describe('Component Tests', () => {
  describe('Moto Management Update Component', () => {
    let comp: MotoUpdateComponent;
    let fixture: ComponentFixture<MotoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let motoService: MotoService;
    let ventaService: VentaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MotoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MotoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MotoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      motoService = TestBed.inject(MotoService);
      ventaService = TestBed.inject(VentaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Venta query and add missing value', () => {
        const moto: IMoto = { id: 456 };
        const venta: IVenta = { id: 26694 };
        moto.venta = venta;

        const ventaCollection: IVenta[] = [{ id: 78982 }];
        spyOn(ventaService, 'query').and.returnValue(of(new HttpResponse({ body: ventaCollection })));
        const additionalVentas = [venta];
        const expectedCollection: IVenta[] = [...additionalVentas, ...ventaCollection];
        spyOn(ventaService, 'addVentaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ moto });
        comp.ngOnInit();

        expect(ventaService.query).toHaveBeenCalled();
        expect(ventaService.addVentaToCollectionIfMissing).toHaveBeenCalledWith(ventaCollection, ...additionalVentas);
        expect(comp.ventasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const moto: IMoto = { id: 456 };
        const venta: IVenta = { id: 10961 };
        moto.venta = venta;

        activatedRoute.data = of({ moto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(moto));
        expect(comp.ventasSharedCollection).toContain(venta);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moto = { id: 123 };
        spyOn(motoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: moto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(motoService.update).toHaveBeenCalledWith(moto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moto = new Moto();
        spyOn(motoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: moto }));
        saveSubject.complete();

        // THEN
        expect(motoService.create).toHaveBeenCalledWith(moto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moto = { id: 123 };
        spyOn(motoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(motoService.update).toHaveBeenCalledWith(moto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVentaById', () => {
        it('Should return tracked Venta primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVentaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
