package com.mycompany.myapp.service.specifications;

import com.mycompany.myapp.domain.Empleado;
import com.mycompany.myapp.domain.Empleado_;
import org.springframework.data.jpa.domain.Specification;

public class EmpleadoSpecification {

    public static Specification<Empleado> getEmpleadoByIdSpec(Long valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(Empleado_.ID), valor);
        };
    }

    public static Specification<Empleado> getEmpleadoByNombreSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Empleado_.NOMBRE), "%" + valor + "%");
        };
    }

    public static Specification<Empleado> getEmpleadoByApellidosSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Empleado_.APELLIDOS), "%" + valor + "%");
        };
    }

    public static Specification<Empleado> getEmpleadoByDnisSpec(String valor) {
        if (valor == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(root.get(Empleado_.DNI), "%" + valor + "%");
        };
    }
}
