import { Directive, ElementRef, OnInit, Renderer2, inject, effect } from '@angular/core';
import { ViewportService } from '../services/shared/viewport.service';

@Directive({
    selector: '[showOnMobile]',
    standalone: true
})
export class ShowOnMobileDirective implements OnInit {
    private viewportService = inject(ViewportService);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    ngOnInit() {
        effect(() => {
            const isMobile = this.viewportService.isMobile();
            if (isMobile) {
                this.renderer.removeStyle(this.el.nativeElement, 'display');
            } else {
                this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
            }
        });
    }
}
