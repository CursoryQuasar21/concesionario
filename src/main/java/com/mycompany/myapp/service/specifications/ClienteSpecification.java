package com.mycompany.myapp.service.specifications;

import com.mycompany.myapp.domain.Cliente;
import com.mycompany.myapp.domain.Cliente_;
import org.springframework.data.jpa.domain.Specification;

public class ClienteSpecification {

    public static Specification<Cliente> getClienteByIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Cliente_.ID), valor);
        };
    }

    public static Specification<Cliente> getClienteByNombreSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Cliente_.NOMBRE), "%" + valor + "%");
        };
    }

    public static Specification<Cliente> getClienteByApellidosSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Cliente_.APELLIDOS), "%" + valor + "%");
        };
    }

    public static Specification<Cliente> getClienteByDnisSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Cliente_.DNI), "%" + valor + "%");
        };
    }
}
