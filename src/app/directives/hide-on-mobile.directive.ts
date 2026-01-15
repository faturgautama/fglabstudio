import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { ViewportService } from '../services/shared/viewport.service';
import { effect } from '@angular/core';

@Directive({
    selector: '[hideOnMobile]',
    standalone: true
})
export class HideOnMobileDirective implements OnInit {
    private viewportService = inject(ViewportService);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    ngOnInit() {
        effect(() => {
            const isMobile = this.viewportService.isMobile();
            if (isMobile) {
                this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
            } else {
                this.renderer.removeStyle(this.el.nativeElement, 'display');
            }
        });
    }
}
