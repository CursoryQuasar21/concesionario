import { IVenta } from 'app/entities/venta/venta.model';

export interface IEmpleado {
  id?: number;
  nombre?: string | null;
  apellidos?: string | null;
  dni?: string | null;
  ventas?: IVenta[] | null;
}

export class Empleado implements IEmpleado {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public apellidos?: string | null,
    public dni?: string | null,
    public ventas?: IVenta[] | null
  ) {}
}

export function getEmpleadoIdentifier(empleado: IEmpleado): number | undefined {
  return empleado.id;
}
