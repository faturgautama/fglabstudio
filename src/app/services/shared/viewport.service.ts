import { Injectable, signal, computed, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

export type ViewportBreakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ViewportState {
    width: number;
    height: number;
    breakpoint: ViewportBreakpoint;
    orientation: 'portrait' | 'landscape';
}

@Injectable({
    providedIn: 'root'
})
export class ViewportService {
    private breakpointObserver = inject(BreakpointObserver);

    private breakpointState = toSignal(
        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ])
    );

    // Signals for viewport state
    isMobile = computed(() => {
        const state = this.breakpointState();
        return state?.breakpoints[Breakpoints.XSmall] || state?.breakpoints[Breakpoints.Small] || false;
    });

    isTablet = computed(() => {
        const state = this.breakpointState();
        return state?.breakpoints[Breakpoints.Medium] || false;
    });

    isDesktop = computed(() => {
        const state = this.breakpointState();
        return state?.breakpoints[Breakpoints.Large] || state?.breakpoints[Breakpoints.XLarge] || false;
    });

    breakpoint = computed<ViewportBreakpoint>(() => {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    });

    viewportState = computed<ViewportState>(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: this.breakpoint(),
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    }));

    /**
     * Check if current viewport matches the given breakpoint
     */
    matches(breakpoint: ViewportBreakpoint): boolean {
        switch (breakpoint) {
            case 'mobile':
                return this.isMobile();
            case 'tablet':
                return this.isTablet();
            case 'desktop':
                return this.isDesktop();
        }
    }

    /**
     * Get responsive classes based on breakpoint
     */
    getResponsiveClasses(config: {
        mobile?: string[];
        tablet?: string[];
        desktop?: string[];
    }): string[] {
        const breakpoint = this.breakpoint();
        return config[breakpoint] || [];
    }
}
