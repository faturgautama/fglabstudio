import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardProductModel } from '../../model/components/card-product.model';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-product',
  imports: [
    ButtonModule,
    TranslatePipe,
    CurrencyPipe,
  ],
  standalone: true,
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss'
})
export class CardProduct {

  @Input() props!: CardProductModel.ICardProduct;

  constructor(private router: Router) { }

  navigateToDetail(): void {
    this.router.navigateByUrl(`/product?id=${this.props.id}`);
  }

  getDiscountPercentage(): number {
    if (!this.props.price || !this.props.discount_price) return 0;
    const discount = ((this.props.price - this.props.discount_price) / this.props.price) * 100;
    return Math.round(discount);
  }

  getAverageRating(): number {
    if (!this.props.review || this.props.review.length === 0) return 0;
    const total = this.props.review.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = total / this.props.review.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal
  }
} 
