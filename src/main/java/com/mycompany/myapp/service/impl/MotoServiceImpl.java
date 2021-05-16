package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Moto;
import com.mycompany.myapp.repository.MotoRepository;
import com.mycompany.myapp.service.MotoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Moto}.
 */
@Service
@Transactional
public class MotoServiceImpl implements MotoService {

    private final Logger log = LoggerFactory.getLogger(MotoServiceImpl.class);

    private final MotoRepository motoRepository;

    public MotoServiceImpl(MotoRepository motoRepository) {
        this.motoRepository = motoRepository;
    }

    @Override
    public Moto save(Moto moto) {
        log.debug("Request to save Moto : {}", moto);
        return motoRepository.save(moto);
    }

    @Override
    public Optional<Moto> partialUpdate(Moto moto) {
        log.debug("Request to partially update Moto : {}", moto);

        return motoRepository
            .findById(moto.getId())
            .map(
                existingMoto -> {
                    if (moto.getColor() != null) {
                        existingMoto.setColor(moto.getColor());
                    }
                    if (moto.getModelo() != null) {
                        existingMoto.setModelo(moto.getModelo());
                    }
                    if (moto.getMarca() != null) {
                        existingMoto.setMarca(moto.getMarca());
                    }
                    if (moto.getAnio() != null) {
                        existingMoto.setAnio(moto.getAnio());
                    }
                    if (moto.getPrecio() != null) {
                        existingMoto.setPrecio(moto.getPrecio());
                    }

                    return existingMoto;
                }
            )
            .map(motoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Moto> findAll(Pageable pageable) {
        log.debug("Request to get all Motos");
        return motoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Moto> findOne(Long id) {
        log.debug("Request to get Moto : {}", id);
        return motoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Moto : {}", id);
        motoRepository.deleteById(id);
    }
}
