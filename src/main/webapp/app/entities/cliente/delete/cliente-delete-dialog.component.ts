import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';

@Component({
  templateUrl: './cliente-delete-dialog.component.html',
})
export class ClienteDeleteDialogComponent {
  cliente?: ICliente;

  constructor(protected clienteService: ClienteService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clienteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
