import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MotoComponent } from './list/moto.component';
import { MotoDetailComponent } from './detail/moto-detail.component';
import { MotoUpdateComponent } from './update/moto-update.component';
import { MotoDeleteDialogComponent } from './delete/moto-delete-dialog.component';
import { MotoRoutingModule } from './route/moto-routing.module';

@NgModule({
  imports: [SharedModule, MotoRoutingModule],
  declarations: [MotoComponent, MotoDetailComponent, MotoUpdateComponent, MotoDeleteDialogComponent],
  entryComponents: [MotoDeleteDialogComponent],
})
export class MotoModule {}
