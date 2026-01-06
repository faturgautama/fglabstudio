import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductModel } from '../../model/components/card-product.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-reviews',
    imports: [
        CommonModule,
        CardModule,
        AvatarModule,
        RatingModule,
        FormsModule
    ],
    templateUrl: './product-reviews.html',
    styleUrl: './product-reviews.scss',
    standalone: true
})
export class ProductReviews {
    @Input() reviews: CardProductModel.ICardProductReview[] = [];

    get hasReviews(): boolean {
        return this.reviews && this.reviews.length > 0;
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
