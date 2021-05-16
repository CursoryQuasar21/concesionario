import * as dayjs from 'dayjs';
import { IVenta } from 'app/entities/venta/venta.model';

export interface IMoto {
  id?: number;
  color?: string | null;
  modelo?: string | null;
  marca?: string | null;
  anio?: dayjs.Dayjs | null;
  precio?: number | null;
  venta?: IVenta | null;
}

export class Moto implements IMoto {
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

export function getMotoIdentifier(moto: IMoto): number | undefined {
  return moto.id;
}
