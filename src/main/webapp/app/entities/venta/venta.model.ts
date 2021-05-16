import * as dayjs from 'dayjs';
import { ICoche } from 'app/entities/coche/coche.model';
import { IMoto } from 'app/entities/moto/moto.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IEmpleado } from 'app/entities/empleado/empleado.model';

export interface IVenta {
  id?: number;
  total?: number | null;
  fecha?: dayjs.Dayjs | null;
  coches?: ICoche[] | null;
  motos?: IMoto[] | null;
  cliente?: ICliente | null;
  empleado?: IEmpleado | null;
}

export class Venta implements IVenta {
  constructor(
    public id?: number,
    public total?: number | null,
    public fecha?: dayjs.Dayjs | null,
    public coches?: ICoche[] | null,
    public motos?: IMoto[] | null,
    public cliente?: ICliente | null,
    public empleado?: IEmpleado | null
  ) {}
}

export function getVentaIdentifier(venta: IVenta): number | undefined {
  return venta.id;
}
