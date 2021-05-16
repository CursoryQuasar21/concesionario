package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Coche;
import com.mycompany.myapp.domain.Venta;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Coche entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CocheRepository extends JpaRepository<Coche, Long> {
    @Modifying
    @Query("update Coche c set c.venta = null where c.id= :cocheId")
    void updateCocheByVentaId(@Param("cocheId") Long cocheId);

    @Query("select coche from Coche coche where coche.venta.id=:ventaId")
    Set<Coche> getlistCoches(@Param("ventaId") Long ventaId);
}
