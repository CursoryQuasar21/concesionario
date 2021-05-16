package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Coche;
import com.mycompany.myapp.domain.Moto;
import com.mycompany.myapp.domain.Venta;
import com.mycompany.myapp.repository.CocheRepository;
import com.mycompany.myapp.repository.MotoRepository;
import com.mycompany.myapp.repository.VentaRepository;
import com.mycompany.myapp.service.VentaService;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Venta}.
 */
@Service
@Transactional
public class VentaServiceImpl implements VentaService {

    private final Logger log = LoggerFactory.getLogger(VentaServiceImpl.class);

    private final VentaRepository ventaRepository;

    private final CocheRepository cocheRepository;

    private final MotoRepository motoRepository;

    public VentaServiceImpl(VentaRepository ventaRepository, CocheRepository cocheRepository, MotoRepository motoRepository) {
        this.ventaRepository = ventaRepository;
        this.cocheRepository = cocheRepository;
        this.motoRepository = motoRepository;
    }

    @Override
    public Venta save(Venta venta) {
        log.debug("Request to save Venta : {}", venta);
        if (venta.getId() != null) {
            if (venta.getCoches() != null) cocheRepository.updateCocheByVentaId(venta.getId());

            if (venta.getCoches() != null) motoRepository.updateMotoByVentaId(venta.getId());
        }

        Set<Coche> listaCoches = cocheRepository.getlistCoches(venta.getId());
        Set<Moto> listaMotos = motoRepository.getlistMotos(venta.getId());
        if (listaCoches != null) {
            for (Coche coche : listaCoches) {
                coche.setVenta(venta);
                cocheRepository.save(coche);
            }
        }
        if (listaMotos != null) {
            for (Moto moto : listaMotos) {
                moto.setVenta(venta);
                motoRepository.save(moto);
            }
        }

        return venta;
    }

    @Override
    public Optional<Venta> partialUpdate(Venta venta) {
        log.debug("Request to partially update Venta : {}", venta);

        return ventaRepository
            .findById(venta.getId())
            .map(
                existingVenta -> {
                    if (venta.getTotal() != null) {
                        existingVenta.setTotal(venta.getTotal());
                    }
                    if (venta.getFecha() != null) {
                        existingVenta.setFecha(venta.getFecha());
                    }

                    return existingVenta;
                }
            )
            .map(ventaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Venta> findAll(Pageable pageable) {
        log.debug("Request to get all Ventas");
        return ventaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Venta> findOne(Long id) {
        log.debug("Request to get Venta : {}", id);
        Venta venta = ventaRepository.getVenta(id);
        Set<Coche> listaCoches = cocheRepository.getlistCoches(id);
        Set<Moto> listaMotos = motoRepository.getlistMotos(id);
        venta.setCoches(listaCoches);
        venta.setMotos(listaMotos);
        Optional<Venta> ventaReturn = Optional.of(venta);
        return ventaReturn;
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Venta : {}", id);
        cocheRepository.updateCocheByVentaId(id);
        motoRepository.updateMotoByVentaId(id);
        ventaRepository.deleteById(id);
    }
}
