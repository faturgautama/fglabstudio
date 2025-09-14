import { Component, OnInit } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { Button, ButtonModule } from "primeng/button";
import { CardService } from '../../components/card-service/card-service';
import { BadgeTitle } from "../../components/badge-title/badge-title";
import { CardServiceModel } from '../../model/components/card-service.model';
import { CountingProof } from "../../components/counting-proof/counting-proof";

@Component({
  selector: 'app-home',
  imports: [
    LandingLayout,
    TranslatePipe,
    UpperCasePipe,
    ButtonModule,
    CardService,
    BadgeTitle,
    CountingProof
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home implements OnInit {

  Services: CardServiceModel.ICardService[];

  Count: any = {
    client: 100,
    project: 50,
    tech_stack: 5,
    experience: 5
  };

  displayCount: Record<string, number> = {};
  keys: string[] = [];

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

  ngOnInit() {
    this.keys = Object.keys(this.Count);
    this.keys.forEach(key => {
      this.displayCount[key] = 0;
      this.animateCount(key, this.Count[key]);
    });
  }

  animateCount(key: string, target: number) {
    const duration = 10000;
    const steps = 60;
    const increment = target / steps;
    const intervalTime = duration / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.displayCount[key] = target;
        clearInterval(interval);
      } else {
        this.displayCount[key] = Math.floor(current);
      }
    }, intervalTime);
  }
}
