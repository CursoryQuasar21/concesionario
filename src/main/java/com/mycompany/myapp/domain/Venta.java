package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Venta.
 */
@Entity
@Table(name = "venta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Venta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total")
    private Double total;

    @Column(name = "fecha")
    private Instant fecha;

    @OneToMany(mappedBy = "venta")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "venta" }, allowSetters = true)
    private Set<Coche> coches = new HashSet<>();

    @OneToMany(mappedBy = "venta")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "venta" }, allowSetters = true)
    private Set<Moto> motos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "ventas" }, allowSetters = true)
    private Cliente cliente;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ventas" }, allowSetters = true)
    private Empleado empleado;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Venta id(Long id) {
        this.id = id;
        return this;
    }

    public Double getTotal() {
        return this.total;
    }

    public Venta total(Double total) {
        this.total = total;
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Instant getFecha() {
        return this.fecha;
    }

    public Venta fecha(Instant fecha) {
        this.fecha = fecha;
        return this;
    }

    public void setFecha(Instant fecha) {
        this.fecha = fecha;
    }

    public Set<Coche> getCoches() {
        return this.coches;
    }

    public Venta coches(Set<Coche> coches) {
        this.setCoches(coches);
        return this;
    }

    public Venta addCoche(Coche coche) {
        this.coches.add(coche);
        coche.setVenta(this);
        return this;
    }

    public Venta removeCoche(Coche coche) {
        this.coches.remove(coche);
        coche.setVenta(null);
        return this;
    }

    public void setCoches(Set<Coche> coches) {
        if (this.coches != null) {
            this.coches.forEach(i -> i.setVenta(null));
        }
        if (coches != null) {
            coches.forEach(i -> i.setVenta(this));
        }
        this.coches = coches;
    }

    public Set<Moto> getMotos() {
        return this.motos;
    }

    public Venta motos(Set<Moto> motos) {
        this.setMotos(motos);
        return this;
    }

    public Venta addMoto(Moto moto) {
        this.motos.add(moto);
        moto.setVenta(this);
        return this;
    }

    public Venta removeMoto(Moto moto) {
        this.motos.remove(moto);
        moto.setVenta(null);
        return this;
    }

    public void setMotos(Set<Moto> motos) {
        if (this.motos != null) {
            this.motos.forEach(i -> i.setVenta(null));
        }
        if (motos != null) {
            motos.forEach(i -> i.setVenta(this));
        }
        this.motos = motos;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public Venta cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Empleado getEmpleado() {
        return this.empleado;
    }

    public Venta empleado(Empleado empleado) {
        this.setEmpleado(empleado);
        return this;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Venta)) {
            return false;
        }
        return id != null && id.equals(((Venta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Venta{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", fecha='" + getFecha() + "'" +
            "}";
    }
}
