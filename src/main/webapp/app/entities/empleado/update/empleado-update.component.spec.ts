jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmpleadoService } from '../service/empleado.service';
import { IEmpleado, Empleado } from '../empleado.model';

import { EmpleadoUpdateComponent } from './empleado-update.component';

describe('Component Tests', () => {
  describe('Empleado Management Update Component', () => {
    let comp: EmpleadoUpdateComponent;
    let fixture: ComponentFixture<EmpleadoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let empleadoService: EmpleadoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmpleadoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmpleadoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmpleadoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      empleadoService = TestBed.inject(EmpleadoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const empleado: IEmpleado = { id: 456 };

        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(empleado));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empleado = { id: 123 };
        spyOn(empleadoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empleado }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(empleadoService.update).toHaveBeenCalledWith(empleado);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empleado = new Empleado();
        spyOn(empleadoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empleado }));
        saveSubject.complete();

        // THEN
        expect(empleadoService.create).toHaveBeenCalledWith(empleado);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empleado = { id: 123 };
        spyOn(empleadoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(empleadoService.update).toHaveBeenCalledWith(empleado);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
