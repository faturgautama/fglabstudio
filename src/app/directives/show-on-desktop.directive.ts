import { Directive, ElementRef, OnInit, Renderer2, inject, effect } from '@angular/core';
import { ViewportService } from '../services/shared/viewport.service';

@Directive({
    selector: '[showOnDesktop]',
    standalone: true
})
export class ShowOnDesktopDirective implements OnInit {
    private viewportService = inject(ViewportService);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    ngOnInit() {
        effect(() => {
            const isDesktop = this.viewportService.isDesktop();
            if (isDesktop) {
                this.renderer.removeStyle(this.el.nativeElement, 'display');
            } else {
                this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
            }
        });
    }
}
