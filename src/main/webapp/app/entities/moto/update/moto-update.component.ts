import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMoto, Moto } from '../moto.model';
import { MotoService } from '../service/moto.service';
import { IVenta } from 'app/entities/venta/venta.model';
import { VentaService } from 'app/entities/venta/service/venta.service';

@Component({
  selector: 'jhi-moto-update',
  templateUrl: './moto-update.component.html',
})
export class MotoUpdateComponent implements OnInit {
  isSaving = false;

  ventasSharedCollection: IVenta[] = [];

  editForm = this.fb.group({
    id: [],
    color: [],
    modelo: [],
    marca: [],
    anio: [],
    precio: [],
    venta: [],
  });

  constructor(
    protected motoService: MotoService,
    protected ventaService: VentaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moto }) => {
      if (moto.id === undefined) {
        const today = dayjs().startOf('day');
        moto.anio = today;
      }

      this.updateForm(moto);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moto = this.createFromForm();
    if (moto.id !== undefined) {
      this.subscribeToSaveResponse(this.motoService.update(moto));
    } else {
      this.subscribeToSaveResponse(this.motoService.create(moto));
    }
  }

  trackVentaById(index: number, item: IVenta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(moto: IMoto): void {
    this.editForm.patchValue({
      id: moto.id,
      color: moto.color,
      modelo: moto.modelo,
      marca: moto.marca,
      anio: moto.anio ? moto.anio.format(DATE_TIME_FORMAT) : null,
      precio: moto.precio,
      venta: moto.venta,
    });

    this.ventasSharedCollection = this.ventaService.addVentaToCollectionIfMissing(this.ventasSharedCollection, moto.venta);
  }

  protected loadRelationshipsOptions(): void {
    this.ventaService
      .query()
      .pipe(map((res: HttpResponse<IVenta[]>) => res.body ?? []))
      .pipe(map((ventas: IVenta[]) => this.ventaService.addVentaToCollectionIfMissing(ventas, this.editForm.get('venta')!.value)))
      .subscribe((ventas: IVenta[]) => (this.ventasSharedCollection = ventas));
  }

  protected createFromForm(): IMoto {
    return {
      ...new Moto(),
      id: this.editForm.get(['id'])!.value,
      color: this.editForm.get(['color'])!.value,
      modelo: this.editForm.get(['modelo'])!.value,
      marca: this.editForm.get(['marca'])!.value,
      anio: this.editForm.get(['anio'])!.value ? dayjs(this.editForm.get(['anio'])!.value, DATE_TIME_FORMAT) : undefined,
      precio: this.editForm.get(['precio'])!.value,
      venta: this.editForm.get(['venta'])!.value,
    };
  }
}
