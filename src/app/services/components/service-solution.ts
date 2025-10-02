import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CardServiceModel } from '../../model/components/card-service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceSolution {

  constructor() { }

  getServiceSolution(): Observable<CardServiceModel.ICardService[]> {
    return of([
      {
        id: 'ui-ux-design',
        title: 'UI/UX Design',
        description: 'HOME.Services List.UI/UX Design.description',
        icon: 'pi pi-palette',
        status: true,
      },
      {
        id: 'web-development',
        title: 'Web Development',
        description: 'HOME.Services List.Web Development.description',
        icon: 'pi pi-globe',
        status: true,
      },
      {
        id: 'app-development',
        title: 'App Development',
        description: 'HOME.Services List.App Development.description',
        icon: 'pi pi-mobile',
        status: true,
      },
      {
        id: 'custom-enterprise-system',
        title: 'Custom Enterprise System',
        description: 'HOME.Services List.Custom Enterprise System.description',
        icon: 'pi pi-objects-column',
        status: true,
      },
    ]);
  }
}
