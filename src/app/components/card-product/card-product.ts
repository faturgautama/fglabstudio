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
} 
