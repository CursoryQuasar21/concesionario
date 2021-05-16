import * as dayjs from 'dayjs';
import { IVenta } from 'app/entities/venta/venta.model';

export interface ICoche {
  id?: number;
  color?: string | null;
  modelo?: string | null;
  marca?: string | null;
  anio?: dayjs.Dayjs | null;
  precio?: number | null;
  venta?: IVenta | null;
}

export class Coche implements ICoche {
  constructor(
    public id?: number,
    public color?: string | null,
    public modelo?: string | null,
    public marca?: string | null,
    public anio?: dayjs.Dayjs | null,
    public precio?: number | null,
    public venta?: IVenta | null
  ) {}
}

export function getCocheIdentifier(coche: ICoche): number | undefined {
  return coche.id;
}
