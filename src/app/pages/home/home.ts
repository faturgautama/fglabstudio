import { Component, OnDestroy, OnInit } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { CardService } from '../../components/card-service/card-service';
import { BadgeTitle } from "../../components/badge-title/badge-title";
import { CardServiceModel } from '../../model/components/card-service.model';
import { CountingProof } from "../../components/counting-proof/counting-proof";
import { CardProduct } from "../../components/card-product/card-product";
import { Store } from '@ngxs/store';
import { ProductAction } from '../../store/product/product.action';
import { ProductState } from '../../store/product/product.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardProductModel } from '../../model/components/card-product.model';

@Component({
  selector: 'app-home',
  imports: [
    LandingLayout,
    TranslatePipe,
    UpperCasePipe,
    ButtonModule,
    CardService,
    BadgeTitle,
    CountingProof,
    CardProduct,
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  Services: CardServiceModel.ICardService[] = [
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
  ];

  Count: any = {
    client: 100,
    project: 50,
    tech_stack: 5,
    experience: 5
  };

  Product$: Observable<CardProductModel.ICardProduct[]>;

  WhyChooseUs = [
    {
      title: 'HOME.Proven Expertise',
      description: 'HOME.Proven Expertise Description',
      icon: 'pi pi-thumbs-up-fill text-2xl text-white'
    },
    {
      title: 'HOME.Innovative Approach',
      description: 'HOME.Innovative Approach Description',
      icon: 'pi pi-lightbulb text-2xl text-white'
    },
    {
      title: 'HOME.Customer-Centric Service',
      description: 'HOME.Customer-Centric Service Description',
      icon: 'pi pi-users text-2xl text-white'
    },
    {
      title: 'HOME.Quality Commitment',
      description: 'HOME.Quality Commitment Description',
      icon: 'pi pi-star-fill text-2xl text-white'
    },
  ];

  WhoWeAreValues = [
    { title: 'HOME.Who We Are Values.Innovation at Core' },
    { title: 'HOME.Who We Are Values.Customer-Centric Thinking' },
    { title: 'HOME.Who We Are Values.Trust and Transparency' },
    { title: 'HOME.Who We Are Values.Empowering Creators' },
    { title: 'HOME.Who We Are Values.Inclusive by Design' },
    { title: 'HOME.Who We Are Values.Sustainable Growth' },
    { title: 'HOME.Who We Are Values.Data-Informed Decisions' },
    { title: 'HOME.Who We Are Values.Community Driven' }
  ];

  constructor(
    private _store: Store
  ) {
    this.Product$ = this._store
      .select(ProductState.getData)
      .pipe(takeUntil(this.Destroy$));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

}
