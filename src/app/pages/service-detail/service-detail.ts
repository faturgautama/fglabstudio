import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServiceDetailModel } from '../../model/pages/service-detail.model';
import { ServiceDetailService } from '../../services/pages/service-detail';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-service-detail',
    standalone: true,
    imports: [
        LandingLayout,
        TranslatePipe,
        ButtonModule,
        DividerModule,
        CommonModule
    ],
    templateUrl: './service-detail.html',
    styleUrl: './service-detail.scss'
})
export class ServiceDetail implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();
    service: ServiceDetailModel.IServiceDetail | null = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private serviceDetailService: ServiceDetailService
    ) { }

    ngOnInit(): void {
        const serviceId = this.route.snapshot.queryParamMap.get('id');

        if (serviceId) {
            this.serviceDetailService
                .getServiceById(serviceId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(service => {
                    this.service = service;
                    this.loading = false;
                });
        } else {
            this.router.navigate(['/']);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleBackNavigation(): void {
        this.router.navigate(['/']);
    }

    handleContactUs(): void {
        const element = document.getElementById('contact_us');
        if (element) {
            this.router.navigate(['/']);
            setTimeout(() => {
                const offset = element!.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }, 100);
        }
    }
}
