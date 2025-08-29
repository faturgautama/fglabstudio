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
        title: 'UI UX Design',
        description: '',
        icon: 'pi pi-pallete',
        status: true,
      }
    ]
  }

}
