import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MotoDetailComponent } from './moto-detail.component';

describe('Component Tests', () => {
  describe('Moto Management Detail Component', () => {
    let comp: MotoDetailComponent;
    let fixture: ComponentFixture<MotoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MotoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ moto: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MotoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MotoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load moto on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.moto).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
