import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardProductModel } from '../../model/components/card-product.model';
import { CardServiceModel } from '../../model/components/card-service.model';
import { ProductState } from '../../store/product';
import { SolutionState } from '../../store/solution';
import { AsyncPipe, NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [
    AsyncPipe,
    TranslatePipe
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true
})
export class Footer implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  Year = new Date().getFullYear();

  Product$: Observable<CardProductModel.ICardProduct[]>;

  Service$: Observable<CardServiceModel.ICardService[]>;

  constructor(
    private _store: Store
  ) {
    this.Product$ = this._store
      .select(ProductState.getData)
      .pipe(takeUntil(this.Destroy$));

    this.Service$ = this._store
      .select(SolutionState.getData)
      .pipe(takeUntil(this.Destroy$));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }
}
