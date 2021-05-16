package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Moto;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Moto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MotoRepository extends JpaRepository<Moto, Long> {
    @Modifying
    @Query("update Moto m set m.venta = null where m.id= :motoId")
    void updateMotoByVentaId(@Param("motoId") Long motoId);

    @Query("select moto from Moto moto where moto.venta.id=:ventaId")
    Set<Moto> getlistMotos(@Param("ventaId") Long ventaId);
}
