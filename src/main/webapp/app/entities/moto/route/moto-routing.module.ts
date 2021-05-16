import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MotoComponent } from '../list/moto.component';
import { MotoDetailComponent } from '../detail/moto-detail.component';
import { MotoUpdateComponent } from '../update/moto-update.component';
import { MotoRoutingResolveService } from './moto-routing-resolve.service';

const motoRoute: Routes = [
  {
    path: '',
    component: MotoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MotoDetailComponent,
    resolve: {
      moto: MotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MotoUpdateComponent,
    resolve: {
      moto: MotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MotoUpdateComponent,
    resolve: {
      moto: MotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(motoRoute)],
  exports: [RouterModule],
})
export class MotoRoutingModule {}
