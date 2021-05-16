package com.mycompany.myapp.service.helpers;

import com.mycompany.myapp.service.dto.EmpleadoDTO;
import java.util.List;

public class EstadisticasHelpers {

    List<EmpleadoDTO> empleadoDTO;

    public EstadisticasHelpers() {}

    public EstadisticasHelpers(List<EmpleadoDTO> empleadoDTO) {
        this.empleadoDTO = empleadoDTO;
    }

    public List<EmpleadoDTO> getEmpleadoDTO() {
        return this.empleadoDTO;
    }

    public void setEmpleadoDTO(List<EmpleadoDTO> empleadoDTO) {
        this.empleadoDTO = empleadoDTO;
    }

    public EstadisticasHelpers empleadoDTO(List<EmpleadoDTO> empleadoDTO) {
        setEmpleadoDTO(empleadoDTO);
        return this;
    }

    @Override
    public String toString() {
        return "{" + " empleadoDTO='" + getEmpleadoDTO() + "'" + "}";
    }
}
