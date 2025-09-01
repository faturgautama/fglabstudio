import { Component } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { Button, ButtonModule } from "primeng/button";
import { CardService } from '../../components/card-service/card-service';
import { BadgeTitle } from "../../components/badge-title/badge-title";
import { CardServiceModel } from '../../model/components/card-service.model';

@Component({
  selector: 'app-home',
  imports: [
    LandingLayout,
    TranslatePipe,
    TranslateDirective,
    UpperCasePipe,
    ButtonModule,
    CardService,
    BadgeTitle
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {

  Services: CardServiceModel.ICardService[];

  constructor() {
    this.Services = [
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
    ]
  }

}
