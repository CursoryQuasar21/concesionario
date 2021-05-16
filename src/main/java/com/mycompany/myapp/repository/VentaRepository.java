package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Venta;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Venta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    @Query("select venta from Venta venta where venta.id=:ventaId")
    Venta getVenta(@Param("ventaId") Long ventaId);
}
