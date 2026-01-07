import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DatabaseService } from '../../app.database';
import { AuthenticationService } from '../../services/pages/authentication/authentication';
import { Product } from '../../services/components/product';
import { CardProductModel } from '../../model/components/card-product.model';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ButtonModule,
    TranslatePipe,
    UpperCasePipe,
    CarouselModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true
})
export class Register implements OnInit {

  databaseService = inject(DatabaseService);

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
  _authenticationService = inject(AuthenticationService);
  _productService = inject(Product);

  loading = false;

  Form = this._formBuilder.group({
    full_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password_confirmation: ['', [Validators.required]],
  });

  ProductDatasource: CardProductModel.ICardProduct[] = [];
  SelectedTrialProduct!: CardProductModel.ICardProduct;

  ngOnInit(): void {
    this.getAllProduct();
  }

  private getAllProduct() {
    this._productService
      .getProduct()
      .subscribe((result) => {
        if (result) {
          this.ProductDatasource = result;
        }
      });
  }

  handleGoToLogin() {
    this._router.navigateByUrl("/login")
  }

  handleRegister(form: any) {
    // Validasi trial product sudah dipilih
    this.loading = true;

    if (!this.SelectedTrialProduct) {
      this._messageService.clear();
      this._messageService.add({
        severity: 'warn',
        summary: 'Perhatian',
        detail: 'Mohon pilih aplikasi trial terlebih dahulu',
      });
      this.loading = false;
      return;
    }

    this._authenticationService
      .signUp(
        form.full_name,
        form.email,
        form.password,
        form.password_confirmation,
        this.SelectedTrialProduct.id
      )
      .subscribe(async (result: any) => {
        if (result.user) {
          // Tunggu switching selesai
          await this.databaseService.switchToUserDatabase(result.user.id);

          this._messageService.clear();
          this._messageService.add({
            severity: 'success',
            summary: 'Berhasil',
            detail: 'Registrasi berhasil! Selamat datang 🎉',
          });

          this.loading = false;

          // Navigate ke your-apps
          this._router.navigateByUrl('/your-apps');
        } else {
          this._messageService.clear();
          this._messageService.add({
            severity: 'error',
            summary: 'Oops',
            detail: 'Registrasi gagal',
          });
          this.loading = false;
        }
      }, (error: any) => {
        this._messageService.clear();
        this._messageService.add({
          severity: 'error',
          summary: 'Oops',
          detail: error.error?.error || 'Terjadi kesalahan',
        });
        this.loading = false;
      });
  }

  handleBackToHome() {
    this._router.navigateByUrl("");
  }

}
