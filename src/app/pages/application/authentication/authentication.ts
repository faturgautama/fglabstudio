import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel'
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from "primeng/table";
import { AuthenticationService } from '../../../services/pages/authentication/authentication';

@Component({
  selector: 'app-authentication',
  imports: [
    FormsModule,
    ButtonModule,
    TranslatePipe,
    UpperCasePipe,
    CarouselModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule
  ],
  standalone: true,
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class Authentication {

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

  _formBuilder = inject(FormBuilder);
  _router = inject(Router);
  _messageService = inject(MessageService);
  _authenticationService = inject(AuthenticationService)

  Form = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  handleLogin(form: any) {
    this._authenticationService
      .signIn(form.email, form.password)
      .subscribe((result) => {
        if (result) {
          this._messageService.clear();
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign In Succesfully' });
          this._router.navigateByUrl('/your-apps');
        } else {
          this._messageService.clear();
          this._messageService.add({ severity: 'error', summary: 'Oops', detail: 'Sign In Failed' });
        }
      }, (error: any) => {
        this._messageService.clear();
        this._messageService.add({ severity: 'error', summary: 'Oops', detail: error.error.error });
      });
  }
}
