import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardProductModel } from '../../model/components/card-product.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-product-reviews',
    imports: [
        CommonModule,
        DatePipe,
        CardModule,
        AvatarModule,
        RatingModule,
        FormsModule,
        TranslatePipe
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

    get averageRating(): number {
        if (!this.hasReviews) return 0;
        const total = this.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        return Math.round((total / this.reviews.length) * 10) / 10;
    }

    get totalReviews(): number {
        return this.reviews.length;
    }

    getStarCount(star: number): number {
        return this.reviews.filter(review => review.rating === star).length;
    }

    getStarPercentage(star: number): number {
        if (!this.hasReviews) return 0;
        return (this.getStarCount(star) / this.totalReviews) * 100;
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
