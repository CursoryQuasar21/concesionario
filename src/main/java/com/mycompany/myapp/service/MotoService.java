package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Moto;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Moto}.
 */
public interface MotoService {
    /**
     * Save a moto.
     *
     * @param moto the entity to save.
     * @return the persisted entity.
     */
    Moto save(Moto moto);

    /**
     * Partially updates a moto.
     *
     * @param moto the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Moto> partialUpdate(Moto moto);

    /**
     * Get all the motos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Moto> findAll(Pageable pageable);

    /**
     * Get the "id" moto.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Moto> findOne(Long id);

    /**
     * Delete the "id" moto.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
