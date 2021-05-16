import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVenta, Venta } from '../venta.model';
import { VentaService } from '../service/venta.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { EmpleadoService } from 'app/entities/empleado/service/empleado.service';
import { CocheService } from 'app/entities/coche/service/coche.service';
import { ICoche } from 'app/entities/coche/coche.model';
import { IMoto } from 'app/entities/moto/moto.model';
import { MotoService } from 'app/entities/moto/service/moto.service';

@Component({
  selector: 'jhi-venta-update',
  templateUrl: './venta-update.component.html',
})
export class VentaUpdateComponent implements OnInit {
  isSaving = false;
  total = 0;

  clientesSharedCollection: ICliente[] = [];
  empleadosSharedCollection: IEmpleado[] = [];
  cochesSharedCollection: ICoche[] = [];
  motosSharedCollection: IMoto[] = [];

  listaCochesComprar: ICoche[] = [];
  listaMotosComprar: IMoto[] = [];

  listaCochesClonada: ICoche[] = [];
  listaMotosClonada: IMoto[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    fecha: [],
    cliente: [],
    empleado: [],
  });

  constructor(
    protected ventaService: VentaService,
    protected clienteService: ClienteService,
    protected empleadoService: EmpleadoService,
    protected cocheService: CocheService,
    protected motoService: MotoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venta }) => {
      if (venta.id === undefined) {
        const today = dayjs().startOf('day');
        venta.fecha = today;
      }

      this.listaCochesClonada = venta.coches;

      this.updateForm(venta);

      this.loadRelationshipsOptions();

      this.loadCoches(venta);
      this.loadMotos(venta);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const venta = this.createFromForm();
    if (venta.id !== undefined) {
      this.subscribeToSaveResponse(this.ventaService.update(venta));
    } else {
      this.subscribeToSaveResponse(this.ventaService.create(venta));
    }
  }

  trackClienteById(index: number, item: ICliente): number {
    return item.id!;
  }

  trackEmpleadoById(index: number, item: IEmpleado): number {
    return item.id!;
  }

  trackCocheById(index: number, item: ICoche): number {
    return item.id!;
  }

  trackMotoById(index: number, item: IMoto): number {
    return item.id!;
  }

  public loadCoches(venta: Venta): void {
    this.cocheService.query().subscribe((res: HttpResponse<ICoche[]>) => {
      res.body?.forEach((coche: ICoche) => {
        if (coche.venta === null) {
          this.cochesSharedCollection.push(coche);
        } else {
          if (venta.id === coche.venta?.id) {
            this.cochesSharedCollection.push(coche);
            this.anadirCocheComprado(coche);
          }
        }
      });
    });
  }

  public anadirCocheComprado(coche: ICoche): void {
    this.listaCochesComprar.push(coche);
    if (coche.precio) {
      this.total = this.total + coche.precio;
    }
  }

  public anadirCoche(coche: ICoche, e: any): void {
    if (e.classList.contains('btn-outline-primary')) {
      this.listaCochesComprar.push(coche);
      if (coche.precio) {
        this.total = this.total + coche.precio;
      }
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      for (let i = 0; i < this.listaCochesComprar.length; i++) {
        if (this.listaCochesComprar[i] === coche) {
          this.listaCochesComprar.splice(i, 1);
          if (coche.precio) {
            this.total = this.total - coche.precio;
          }
        }
      }
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
  }

  public loadMotos(venta: Venta): void {
    this.motoService.query().subscribe((res: HttpResponse<IMoto[]>) => {
      res.body?.forEach((moto: IMoto) => {
        if (moto.venta === null) {
          this.motosSharedCollection.push(moto);
        } else {
          if (venta.id === moto.venta?.id) {
            this.motosSharedCollection.push(moto);
            this.anadirMotoComprado(moto);
          }
        }
      });
    });
  }

  public anadirMotoComprado(moto: IMoto): void {
    this.listaMotosComprar.push(moto);
    if (moto.precio) {
      this.total = this.total + moto.precio;
    }
  }

  public anadirMoto(moto: IMoto, e: any): void {
    if (e.classList.contains('btn-outline-primary')) {
      this.listaMotosComprar.push(moto);
      if (moto.precio) {
        this.total = this.total + moto.precio;
      }
      e.classList.remove('btn-outline-primary');
      e.classList.add('btn-outline-danger');
      e.textContent = 'Eliminar';
    } else {
      for (let i = 0; i < this.listaMotosComprar.length; i++) {
        if (this.listaMotosComprar[i] === moto) {
          this.listaMotosComprar.splice(i, 1);
        }
      }
      if (moto.precio) {
        this.total = this.total - moto.precio;
      }
      e.classList.remove('btn-outline-danger');
      e.classList.add('btn-outline-primary');
      e.textContent = 'Añadir';
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVenta>>): void {
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

  protected updateForm(venta: IVenta): void {
    this.editForm.patchValue({
      id: venta.id,
      total: venta.total,
      fecha: venta.fecha ? venta.fecha.format(DATE_TIME_FORMAT) : null,
      cliente: venta.cliente,
      empleado: venta.empleado,
      coches: this.listaCochesComprar,
      motos: this.listaMotosComprar,
    });

    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(this.clientesSharedCollection, venta.cliente);
    this.empleadosSharedCollection = this.empleadoService.addEmpleadoToCollectionIfMissing(this.empleadosSharedCollection, venta.empleado);
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.empleadoService
      .query()
      .pipe(map((res: HttpResponse<IEmpleado[]>) => res.body ?? []))
      .pipe(
        map((empleados: IEmpleado[]) =>
          this.empleadoService.addEmpleadoToCollectionIfMissing(empleados, this.editForm.get('empleado')!.value)
        )
      )
      .subscribe((empleados: IEmpleado[]) => (this.empleadosSharedCollection = empleados));
  }

  protected createFromForm(): IVenta {
    return {
      ...new Venta(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      cliente: this.editForm.get(['cliente'])!.value,
      empleado: this.editForm.get(['empleado'])!.value,
      coches: this.listaCochesComprar,
      motos: this.listaMotosComprar,
    };
  }
}
