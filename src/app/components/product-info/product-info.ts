import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CardProductModel } from '../../model/components/card-product.model';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-product-info',
    imports: [
        CommonModule,
        CurrencyPipe,
        TagModule,
        ChipModule
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
}
