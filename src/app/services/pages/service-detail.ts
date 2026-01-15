import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceDetailModel } from '../../model/pages/service-detail.model';

@Injectable({
    providedIn: 'root'
})
export class ServiceDetailService {

    constructor() { }

    getServiceById(id: string): Observable<ServiceDetailModel.IServiceDetail | null> {
        const services: ServiceDetailModel.IServiceDetail[] = [
            {
                id: 'ui-ux-design',
                title: 'SERVICE.UI/UX Design.title',
                description: 'SERVICE.UI/UX Design.description',
                icon: 'pi pi-palette',
                benefits: [
                    'SERVICE.UI/UX Design.benefits.1',
                    'SERVICE.UI/UX Design.benefits.2',
                    'SERVICE.UI/UX Design.benefits.3',
                    'SERVICE.UI/UX Design.benefits.4',
                ],
                workflow: [
                    {
                        step: 1,
                        title: 'SERVICE.UI/UX Design.workflow.1.title',
                        description: 'SERVICE.UI/UX Design.workflow.1.description',
                        icon: 'pi pi-search'
                    },
                    {
                        step: 2,
                        title: 'SERVICE.UI/UX Design.workflow.2.title',
                        description: 'SERVICE.UI/UX Design.workflow.2.description',
                        icon: 'pi pi-pencil'
                    },
                    {
                        step: 3,
                        title: 'SERVICE.UI/UX Design.workflow.3.title',
                        description: 'SERVICE.UI/UX Design.workflow.3.description',
                        icon: 'pi pi-palette'
                    },
                    {
                        step: 4,
                        title: 'SERVICE.UI/UX Design.workflow.4.title',
                        description: 'SERVICE.UI/UX Design.workflow.4.description',
                        icon: 'pi pi-check-circle'
                    },
                    {
                        step: 5,
                        title: 'SERVICE.UI/UX Design.workflow.5.title',
                        description: 'SERVICE.UI/UX Design.workflow.5.description',
                        icon: 'pi pi-send'
                    }
                ],
                deliverables: [
                    'SERVICE.UI/UX Design.deliverables.1',
                    'SERVICE.UI/UX Design.deliverables.2',
                    'SERVICE.UI/UX Design.deliverables.3',
                    'SERVICE.UI/UX Design.deliverables.4',
                    'SERVICE.UI/UX Design.deliverables.5',
                ],
                timeline: 'SERVICE.UI/UX Design.timeline',
                price_start: 'SERVICE.UI/UX Design.price_start'
            },
            {
                id: 'web-development',
                title: 'SERVICE.Web Development.title',
                description: 'SERVICE.Web Development.description',
                icon: 'pi pi-globe',
                benefits: [
                    'SERVICE.Web Development.benefits.1',
                    'SERVICE.Web Development.benefits.2',
                    'SERVICE.Web Development.benefits.3',
                    'SERVICE.Web Development.benefits.4',
                ],
                workflow: [
                    {
                        step: 1,
                        title: 'SERVICE.Web Development.workflow.1.title',
                        description: 'SERVICE.Web Development.workflow.1.description',
                        icon: 'pi pi-comments'
                    },
                    {
                        step: 2,
                        title: 'SERVICE.Web Development.workflow.2.title',
                        description: 'SERVICE.Web Development.workflow.2.description',
                        icon: 'pi pi-sitemap'
                    },
                    {
                        step: 3,
                        title: 'SERVICE.Web Development.workflow.3.title',
                        description: 'SERVICE.Web Development.workflow.3.description',
                        icon: 'pi pi-code'
                    },
                    {
                        step: 4,
                        title: 'SERVICE.Web Development.workflow.4.title',
                        description: 'SERVICE.Web Development.workflow.4.description',
                        icon: 'pi pi-shield'
                    },
                    {
                        step: 5,
                        title: 'SERVICE.Web Development.workflow.5.title',
                        description: 'SERVICE.Web Development.workflow.5.description',
                        icon: 'pi pi-cloud-upload'
                    }
                ],
                deliverables: [
                    'SERVICE.Web Development.deliverables.1',
                    'SERVICE.Web Development.deliverables.2',
                    'SERVICE.Web Development.deliverables.3',
                    'SERVICE.Web Development.deliverables.4',
                    'SERVICE.Web Development.deliverables.5',
                ],
                timeline: 'SERVICE.Web Development.timeline',
                price_start: 'SERVICE.Web Development.price_start'
            },
            {
                id: 'app-development',
                title: 'SERVICE.App Development.title',
                description: 'SERVICE.App Development.description',
                icon: 'pi pi-mobile',
                benefits: [
                    'SERVICE.App Development.benefits.1',
                    'SERVICE.App Development.benefits.2',
                    'SERVICE.App Development.benefits.3',
                    'SERVICE.App Development.benefits.4',
                ],
                workflow: [
                    {
                        step: 1,
                        title: 'SERVICE.App Development.workflow.1.title',
                        description: 'SERVICE.App Development.workflow.1.description',
                        icon: 'pi pi-compass'
                    },
                    {
                        step: 2,
                        title: 'SERVICE.App Development.workflow.2.title',
                        description: 'SERVICE.App Development.workflow.2.description',
                        icon: 'pi pi-palette'
                    },
                    {
                        step: 3,
                        title: 'SERVICE.App Development.workflow.3.title',
                        description: 'SERVICE.App Development.workflow.3.description',
                        icon: 'pi pi-code'
                    },
                    {
                        step: 4,
                        title: 'SERVICE.App Development.workflow.4.title',
                        description: 'SERVICE.App Development.workflow.4.description',
                        icon: 'pi pi-check-circle'
                    },
                    {
                        step: 5,
                        title: 'SERVICE.App Development.workflow.5.title',
                        description: 'SERVICE.App Development.workflow.5.description',
                        icon: 'pi pi-upload'
                    }
                ],
                deliverables: [
                    'SERVICE.App Development.deliverables.1',
                    'SERVICE.App Development.deliverables.2',
                    'SERVICE.App Development.deliverables.3',
                    'SERVICE.App Development.deliverables.4',
                    'SERVICE.App Development.deliverables.5',
                ],
                timeline: 'SERVICE.App Development.timeline',
                price_start: 'SERVICE.App Development.price_start'
            },
            {
                id: 'custom-enterprise-system',
                title: 'SERVICE.Custom Enterprise System.title',
                description: 'SERVICE.Custom Enterprise System.description',
                icon: 'pi pi-objects-column',
                benefits: [
                    'SERVICE.Custom Enterprise System.benefits.1',
                    'SERVICE.Custom Enterprise System.benefits.2',
                    'SERVICE.Custom Enterprise System.benefits.3',
                    'SERVICE.Custom Enterprise System.benefits.4',
                ],
                workflow: [
                    {
                        step: 1,
                        title: 'SERVICE.Custom Enterprise System.workflow.1.title',
                        description: 'SERVICE.Custom Enterprise System.workflow.1.description',
                        icon: 'pi pi-chart-line'
                    },
                    {
                        step: 2,
                        title: 'SERVICE.Custom Enterprise System.workflow.2.title',
                        description: 'SERVICE.Custom Enterprise System.workflow.2.description',
                        icon: 'pi pi-sitemap'
                    },
                    {
                        step: 3,
                        title: 'SERVICE.Custom Enterprise System.workflow.3.title',
                        description: 'SERVICE.Custom Enterprise System.workflow.3.description',
                        icon: 'pi pi-sync'
                    },
                    {
                        step: 4,
                        title: 'SERVICE.Custom Enterprise System.workflow.4.title',
                        description: 'SERVICE.Custom Enterprise System.workflow.4.description',
                        icon: 'pi pi-users'
                    },
                    {
                        step: 5,
                        title: 'SERVICE.Custom Enterprise System.workflow.5.title',
                        description: 'SERVICE.Custom Enterprise System.workflow.5.description',
                        icon: 'pi pi-rocket'
                    }
                ],
                deliverables: [
                    'SERVICE.Custom Enterprise System.deliverables.1',
                    'SERVICE.Custom Enterprise System.deliverables.2',
                    'SERVICE.Custom Enterprise System.deliverables.3',
                    'SERVICE.Custom Enterprise System.deliverables.4',
                    'SERVICE.Custom Enterprise System.deliverables.5',
                ],
                timeline: 'SERVICE.Custom Enterprise System.timeline',
                price_start: 'SERVICE.Custom Enterprise System.price_start'
            }
        ];

        const service = services.find(s => s.id === id);
        return of(service || null);
    }
}
