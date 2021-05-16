jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VentaService } from '../service/venta.service';
import { IVenta, Venta } from '../venta.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { EmpleadoService } from 'app/entities/empleado/service/empleado.service';

import { VentaUpdateComponent } from './venta-update.component';

describe('Component Tests', () => {
  describe('Venta Management Update Component', () => {
    let comp: VentaUpdateComponent;
    let fixture: ComponentFixture<VentaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ventaService: VentaService;
    let clienteService: ClienteService;
    let empleadoService: EmpleadoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VentaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VentaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VentaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ventaService = TestBed.inject(VentaService);
      clienteService = TestBed.inject(ClienteService);
      empleadoService = TestBed.inject(EmpleadoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Cliente query and add missing value', () => {
        const venta: IVenta = { id: 456 };
        const cliente: ICliente = { id: 3379 };
        venta.cliente = cliente;

        const clienteCollection: ICliente[] = [{ id: 40362 }];
        spyOn(clienteService, 'query').and.returnValue(of(new HttpResponse({ body: clienteCollection })));
        const additionalClientes = [cliente];
        const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
        spyOn(clienteService, 'addClienteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(clienteService.query).toHaveBeenCalled();
        expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(clienteCollection, ...additionalClientes);
        expect(comp.clientesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Empleado query and add missing value', () => {
        const venta: IVenta = { id: 456 };
        const empleado: IEmpleado = { id: 59570 };
        venta.empleado = empleado;

        const empleadoCollection: IEmpleado[] = [{ id: 86949 }];
        spyOn(empleadoService, 'query').and.returnValue(of(new HttpResponse({ body: empleadoCollection })));
        const additionalEmpleados = [empleado];
        const expectedCollection: IEmpleado[] = [...additionalEmpleados, ...empleadoCollection];
        spyOn(empleadoService, 'addEmpleadoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(empleadoService.query).toHaveBeenCalled();
        expect(empleadoService.addEmpleadoToCollectionIfMissing).toHaveBeenCalledWith(empleadoCollection, ...additionalEmpleados);
        expect(comp.empleadosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const venta: IVenta = { id: 456 };
        const cliente: ICliente = { id: 10229 };
        venta.cliente = cliente;
        const empleado: IEmpleado = { id: 75118 };
        venta.empleado = empleado;

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(venta));
        expect(comp.clientesSharedCollection).toContain(cliente);
        expect(comp.empleadosSharedCollection).toContain(empleado);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = { id: 123 };
        spyOn(ventaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: venta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ventaService.update).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = new Venta();
        spyOn(ventaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: venta }));
        saveSubject.complete();

        // THEN
        expect(ventaService.create).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = { id: 123 };
        spyOn(ventaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ventaService.update).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackClienteById', () => {
        it('Should return tracked Cliente primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClienteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackEmpleadoById', () => {
        it('Should return tracked Empleado primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmpleadoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
