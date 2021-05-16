package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Coche;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Coche}.
 */
public interface CocheService {
    /**
     * Save a coche.
     *
     * @param coche the entity to save.
     * @return the persisted entity.
     */
    Coche save(Coche coche);

    /**
     * Partially updates a coche.
     *
     * @param coche the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Coche> partialUpdate(Coche coche);

    /**
     * Get all the coches.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Coche> findAll(Pageable pageable);

    /**
     * Get the "id" coche.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Coche> findOne(Long id);

    /**
     * Delete the "id" coche.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
