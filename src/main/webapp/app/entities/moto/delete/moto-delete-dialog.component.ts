import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoto } from '../moto.model';
import { MotoService } from '../service/moto.service';

@Component({
  templateUrl: './moto-delete-dialog.component.html',
})
export class MotoDeleteDialogComponent {
  moto?: IMoto;

  constructor(protected motoService: MotoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.motoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
