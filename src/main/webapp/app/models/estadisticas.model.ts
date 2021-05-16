import { IEmpleadoDTO } from './empleadoDTO.model';

export interface IEstadisticas {
  empleadoDTO?: IEmpleadoDTO;
}

export class Estadisticas implements IEstadisticas {
  constructor(public empleadoDTO?: IEmpleadoDTO) {}
}
