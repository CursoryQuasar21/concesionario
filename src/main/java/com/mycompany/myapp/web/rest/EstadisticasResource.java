package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.EstadisticasHelpersService;
import com.mycompany.myapp.service.helpers.EstadisticasHelpers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
public class EstadisticasResource {

    private final Logger log = LoggerFactory.getLogger(EmpleadoResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstadisticasHelpersService estadisticasHelpersService;

    public EstadisticasResource(EstadisticasHelpersService estadisticasHelpersService) {
        this.estadisticasHelpersService = estadisticasHelpersService;
    }

    /**
     * {@code GET  /empleados} : get all the empleados.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of empleados in body.
     */
    @GetMapping("/estadistica")
    public ResponseEntity<EstadisticasHelpers> getAllEstadistica() {
        log.debug("REST request to get a page of Empleados");
        EstadisticasHelpers estadistica = estadisticasHelpersService.findAll();

        return ResponseEntity.ok().body(estadistica);
    }
}
