import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CardProductModel } from '../../model/components/card-product.model';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TranslatePipe } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-product-info',
    imports: [
        CommonModule,
        CurrencyPipe,
        DatePipe,
        TagModule,
        ChipModule,
        TranslatePipe,
        DividerModule
    ],
    templateUrl: './product-info.html',
    styleUrl: './product-info.scss',
    standalone: true
})
export class ProductInfo {
    @Input() product!: CardProductModel.ICardProduct;

    get hasDiscount(): boolean {
        return this.product && this.product.discount_price < this.product.price;
    }

    get discountPercentage(): number {
        if (!this.hasDiscount) return 0;
        return Math.round(((this.product.price - this.product.discount_price) / this.product.price) * 100);
    }

    get displayPrice(): number {
        return this.product?.discount_price || this.product?.price || 0;
    }

    get averageRating(): number {
        if (!this.product?.review || this.product.review.length === 0) return 0;
        const total = this.product.review.reduce((sum, review) => sum + (review.rating || 0), 0);
        return Math.round((total / this.product.review.length) * 10) / 10;
    }

    get totalReviews(): number {
        return this.product?.review?.length || 0;
    }
}
