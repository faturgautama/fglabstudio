import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-product-cta',
    imports: [
        CommonModule,
        ButtonModule
    ],
    templateUrl: './product-cta.html',
    styleUrl: './product-cta.scss',
    standalone: true
})
export class ProductCTA {
    @Input() productId: string = '';
    @Input() productPrice: number = 0;

    @Output() onContactUs = new EventEmitter<void>();
    @Output() onBuyNow = new EventEmitter<string>();

    handleContactUs(): void {
        this.onContactUs.emit();
    }

    handleBuyNow(): void {
        this.onBuyNow.emit(this.productId);
    }
}
