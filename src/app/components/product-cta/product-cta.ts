import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-product-cta',
    imports: [
        CommonModule,
        ButtonModule,
        TranslatePipe
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

    _router = inject(Router);

    handleClickButton(id: string) {
        if (id == 'login') {
            this._router.navigateByUrl("/login");
            return;
        }

        if (id == 'register') {
            this._router.navigateByUrl("/register");
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            const offset = element!.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }
}
