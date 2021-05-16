package com.mycompany.myapp.service.specifications;

import com.mycompany.myapp.domain.Moto;
import com.mycompany.myapp.domain.Moto_;
import java.time.Instant;
import org.springframework.data.jpa.domain.Specification;

public class MotoSpecification {

    public static Specification<Moto> getMotoByIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Moto_.ID), valor);
        };
    }

    public static Specification<Moto> getMotoByColorSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Moto_.COLOR), "%" + valor + "%");
        };
    }

    public static Specification<Moto> getMotoByModeloSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Moto_.MODELO), "%" + valor + "%");
        };
    }

    public static Specification<Moto> getMotoByMarcaSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Moto_.MARCA), "%" + valor + "%");
        };
    }

    public static Specification<Moto> getMotoByAnioSpec(Instant valorA, Instant valorD) {
        Instant AuxA = comprobadorFecha(valorA);
        Instant AuxD = comprobadorFechaD(valorD);
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.between(root.get(Moto_.ANIO), AuxA, AuxD);
        };
    }

    public static Specification<Moto> getMotoByPrecioSpec(Double valorA, Double valorD) {
        double valorNulo = 0;
        double valorInfinito = 9999999;
        if (valorA == null && valorD == null) {
            return null;
        } else {
            if (valorA != null && valorD != null) {
                return (root, query, criteriaBuilder) -> {
                    return criteriaBuilder.between(root.get(Moto_.PRECIO), valorA, valorD);
                };
            } else {
                if (valorA == null) {
                    return (root, query, criteriaBuilder) -> {
                        return criteriaBuilder.between(root.get(Moto_.PRECIO), valorNulo, valorD);
                    };
                }
                if (valorD == null) {
                    return (root, query, criteriaBuilder) -> {
                        return criteriaBuilder.between(root.get(Moto_.PRECIO), valorA, valorInfinito);
                    };
                }
            }
        }
        return null;
    }

    public static Specification<Moto> getMotoByVentaIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Moto_.VENTA), valor);
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
