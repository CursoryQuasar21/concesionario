package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.repository.EmpleadoRepository;
import com.mycompany.myapp.service.EstadisticasHelpersService;
import com.mycompany.myapp.service.helpers.EstadisticasHelpers;
import org.springframework.data.domain.PageRequest;

public class EstadisticasHelpersImpl implements EstadisticasHelpersService {

    private final EmpleadoRepository empleadoRepository;

    public EstadisticasHelpersImpl(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public EstadisticasHelpers findAll() {
        EstadisticasHelpers estadisticaH = new EstadisticasHelpers();
        estadisticaH.setEmpleadoDTO(empleadoRepository.findEmployeesByVentaTotal(PageRequest.of(0, 3)));
        return estadisticaH;
    }
}
