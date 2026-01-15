import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, map, tap } from 'rxjs';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { CardProductModel } from '../../model/components/card-product.model';
import { ProductState } from '../../store/product/product.state';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProductImageGallery } from '../../components/product-image-gallery/product-image-gallery';
import { ProductInfo } from '../../components/product-info/product-info';
import { ProductReviews } from '../../components/product-reviews/product-reviews';
import { ProductCTA } from '../../components/product-cta/product-cta';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-product-detail',
    imports: [
        LandingLayout,
        CommonModule,
        AsyncPipe,
        ButtonModule,
        ProductImageGallery,
        ProductInfo,
        ProductReviews,
        ProductCTA,
        TranslatePipe
    ],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.scss',
    standalone: true,
    providers: [MessageService]
})
export class ProductDetail implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    product$!: Observable<CardProductModel.ICardProduct | null>;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private location: Location,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.getRouteParams();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getRouteParams() {
        this.loading = true;

        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                if (!result['id']) {
                    this.router.navigate(['/']);
                    return;
                }

                this.getProduct(result['id']);
                this.loading = false;
            });
    }

    private getProduct(id: string) {
        this.product$ = this.store
            .select(ProductState.getProductById)
            .pipe(
                map(fn => fn(parseInt(id))),
                tap(product => {
                    if (!product) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Product Not Found',
                            detail: 'The product you are looking for does not exist'
                        });
                        setTimeout(() => {
                            this.router.navigate(['/']);
                        }, 2000);
                    }
                }),
                takeUntil(this.destroy$)
            );
    }

    handleBackNavigation(): void {
        try {
            this.location.back();
        } catch (error) {
            this.router.navigate(['/']);
        }
    }

    handleContactUs(): void {
        this.router.navigate(['/']).then(() => {
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
