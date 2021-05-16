import { IVenta } from 'app/entities/venta/venta.model';

export interface ICliente {
  id?: number;
  nombre?: string | null;
  apellidos?: string | null;
  dni?: string | null;
  ventas?: IVenta[] | null;
}

export class Cliente implements ICliente {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public apellidos?: string | null,
    public dni?: string | null,
    public ventas?: IVenta[] | null
  ) {}
}

export function getClienteIdentifier(cliente: ICliente): number | undefined {
  return cliente.id;
}
