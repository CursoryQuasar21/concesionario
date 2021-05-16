package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.Empleado;

public class EmpleadoDTO {

    Empleado empleado;
    double total;

    public EmpleadoDTO() {}

    public EmpleadoDTO(Empleado empleado, double total) {
        this.empleado = empleado;
        this.total = total;
    }

    public Empleado getEmpleado() {
        return this.empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public double getTotal() {
        return this.total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public EmpleadoDTO empleado(Empleado empleado) {
        setEmpleado(empleado);
        return this;
    }

    public EmpleadoDTO total(double total) {
        setTotal(total);
        return this;
    }

    @Override
    public String toString() {
        return "{" + " empleado='" + getEmpleado() + "'" + ", total='" + getTotal() + "'" + "}";
    }
}
