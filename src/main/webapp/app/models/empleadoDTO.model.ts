import { IEmpleado } from 'app/entities/empleado/empleado.model';

export interface IEmpleadoDTO {
  empleado?: IEmpleado;
  total?: number;
}

export class EmpleadoDTO implements IEmpleadoDTO {
  constructor(public empleado?: IEmpleado, public total?: number) {}
}
