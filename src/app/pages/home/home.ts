import { Component, OnDestroy, OnInit } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { CardService } from '../../components/card-service/card-service';
import { BadgeTitle } from "../../components/badge-title/badge-title";
import { CardServiceModel } from '../../model/components/card-service.model';
import { CardProduct } from "../../components/card-product/card-product";
import { Store } from '@ngxs/store';
import { ProductState } from '../../store/product/product.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CardProductModel } from '../../model/components/card-product.model';
import { AccordionModule } from 'primeng/accordion';
import { SolutionState } from '../../store/solution';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../services/pages/contact';
import { ContactModel } from '../../model/pages/contact.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-home',
  imports: [
    LandingLayout,
    TranslatePipe,
    UpperCasePipe,
    ButtonModule,
    CardService,
    BadgeTitle,
    CardProduct,
    AsyncPipe,
    AccordionModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  Services$: Observable<CardServiceModel.ICardService[]>;

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

  Faq = [
    { question: 'HOME.FAQ Datasource.1.question', answer: 'HOME.FAQ Datasource.1.answer' },
    { question: 'HOME.FAQ Datasource.2.question', answer: 'HOME.FAQ Datasource.2.answer' },
    { question: 'HOME.FAQ Datasource.3.question', answer: 'HOME.FAQ Datasource.3.answer' },
    { question: 'HOME.FAQ Datasource.4.question', answer: 'HOME.FAQ Datasource.4.answer' },
    { question: 'HOME.FAQ Datasource.5.question', answer: 'HOME.FAQ Datasource.5.answer' },
    { question: 'HOME.FAQ Datasource.6.question', answer: 'HOME.FAQ Datasource.6.answer' },
    { question: 'HOME.FAQ Datasource.7.question', answer: 'HOME.FAQ Datasource.7.answer' },
    { question: 'HOME.FAQ Datasource.8.question', answer: 'HOME.FAQ Datasource.8.answer' },
    { question: 'HOME.FAQ Datasource.9.question', answer: 'HOME.FAQ Datasource.9.answer' },
  ];

  ContactForm: FormGroup;

  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _contactService: Contact,
  ) {
    this.Product$ = this._store
      .select(ProductState.getData)
      .pipe(takeUntil(this.Destroy$));

    this.Services$ = this._store
      .select(SolutionState.getData)
      .pipe(takeUntil(this.Destroy$));

    this.ContactForm = this._formBuilder.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      content: ['', [Validators.required]],
      ip_address: ['', []],
      city: ['', []],
      region: ['', []],
      country: ['', []],
      created_at: ['', []],
    });
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.handleSubmitContact(this.ContactForm.value);
    // }, 1000);

    // this._contactService
    //   .getContact()
    //   .subscribe((result) => {
    //     console.log(result);
    //   })
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleSubmitContact(data: ContactModel.Submit) {
    this._contactService
      .submitForm(data)
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        console.log(result);
      })
  }
}
