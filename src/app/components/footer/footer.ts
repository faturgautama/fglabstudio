import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardProductModel } from '../../model/components/card-product.model';
import { CardServiceModel } from '../../model/components/card-service.model';
import { ProductState } from '../../store/product';
import { SolutionState } from '../../store/solution';
import { AsyncPipe, NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialMediaList } from "../social-media-list/social-media-list";
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    AsyncPipe,
    TranslatePipe,
    SocialMediaList
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
    private _store: Store,
    private _router: Router,
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

  handleClickProduct(item: CardProductModel.ICardProduct) {
    this._router.navigateByUrl(`/product?id=${item.id}`)
  }

  handleClickService(item: CardServiceModel.ICardService) {
    this._router.navigateByUrl(`/service?id=${item.id}`)
  }

  handleClickContactUs() {
    const currentUrl = this._router.url;

    // Jika sedang di halaman home, langsung scroll
    if (currentUrl === '/' || currentUrl === '') {
      const element = document.getElementById('contact_us');
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    } else {
      // Jika tidak di home, navigate ke home dulu baru scroll
      this._router.navigateByUrl('/').then(() => {
        setTimeout(() => {
          const element = document.getElementById('contact_us');
          if (element) {
            const offset = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }, 100);
      });
    }
  }

  handleClickTerms() {
    this._router.navigateByUrl('/terms-and-conditions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleClickRefund() {
    this._router.navigateByUrl('/refund-policy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
