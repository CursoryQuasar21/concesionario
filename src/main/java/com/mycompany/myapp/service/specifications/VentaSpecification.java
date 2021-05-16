package com.mycompany.myapp.service.specifications;

import com.mycompany.myapp.domain.Venta;
import com.mycompany.myapp.domain.Venta_;
import java.time.Instant;
import java.time.LocalDateTime;
import org.springframework.data.jpa.domain.Specification;

public class VentaSpecification {

    public static Specification<Venta> getVentaByIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Venta_.ID), valor);
        };
    }

    public static Specification<Venta> getVentaByTotalSpec(Double valorA, Double valorD) {
        double valorNulo = 0;
        double valorInfinito = 9999999;
        if (valorA == null && valorD == null) {
            return null;
        } else {
            if (valorA != null && valorD != null) {
                return (root, query, criteriaBuilder) -> {
                    return criteriaBuilder.between(root.get(Venta_.TOTAL), valorA, valorD);
                };
            } else {
                if (valorA == null) {
                    return (root, query, criteriaBuilder) -> {
                        return criteriaBuilder.between(root.get(Venta_.TOTAL), valorNulo, valorD);
                    };
                }
                if (valorD == null) {
                    return (root, query, criteriaBuilder) -> {
                        return criteriaBuilder.between(root.get(Venta_.TOTAL), valorA, valorInfinito);
                    };
                }
            }
        }
        return null;
    }

    public static Specification<Venta> getVentaByAnioSpec(Instant valorA, Instant valorD) {
        Instant AuxA = comprobadorFecha(valorA);
        Instant AuxD = comprobadorFechaD(valorA);
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.between(root.get(Venta_.FECHA), AuxA, AuxD);
        };
    }

    public static Specification<Venta> getVentaByClienteIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Venta_.CLIENTE), "%" + valor + "%");
        };
    }

    public static Specification<Venta> getVentaByEmpleadoIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Venta_.EMPLEADO), "%" + valor + "%");
        };
    }

    public static Instant comprobadorFecha(Instant valor) {
        if (valor == null) {
            valor = Instant.parse("1900-12-07T05:33:00Z");
        }
        return valor;
    }

    public static Instant comprobadorFechaD(Instant valor) {
        if (valor == null) {}
        return valor;
    }
}
