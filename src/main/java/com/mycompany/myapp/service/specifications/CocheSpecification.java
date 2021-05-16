package com.mycompany.myapp.service.specifications;

import com.mycompany.myapp.domain.Coche;
import com.mycompany.myapp.domain.Coche_;
import com.mycompany.myapp.domain.Venta;
import com.mycompany.myapp.domain.Venta_;
import java.time.Instant;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.SetJoin;
import org.springframework.data.jpa.domain.Specification;

public class CocheSpecification {

    public static Specification<Coche> getCocheByIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Coche_.ID), valor);
        };
    }

    public static Specification<Coche> getCocheByColorSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Coche_.COLOR), "%" + valor + "%");
        };
    }

    public static Specification<Coche> getCocheByModeloSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Coche_.MODELO), "%" + valor + "%");
        };
    }

    public static Specification<Coche> getCocheByMarcaSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Coche_.MARCA), "%" + valor + "%");
        };
    }

    public static Specification<Coche> getCocheByAnioSpec(Instant valorA, Instant valorD) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.between(root.get(Coche_.ANIO), valorA, valorD);
        };
    }

    public static Specification<Coche> getCocheByPrecioSpec(Double valorA, Double valorD) {
        if (valorA == null && valorD == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.between(root.get(Coche_.PRECIO), valorA, valorD);
        };
    }

    public static Specification<Coche> getCocheByVentaIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            Join<Coche, Venta> ventaJoin = root.join(Coche_.VENTA);
            return criteriaBuilder.equal(ventaJoin.get(Venta_.ID), valor);
        };
    }
}
