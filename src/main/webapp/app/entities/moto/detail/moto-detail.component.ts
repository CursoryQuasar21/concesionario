import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoto } from '../moto.model';

@Component({
  selector: 'jhi-moto-detail',
  templateUrl: './moto-detail.component.html',
})
export class MotoDetailComponent implements OnInit {
  moto: IMoto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moto }) => {
      this.moto = moto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
