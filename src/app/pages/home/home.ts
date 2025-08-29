import { Component } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { Button, ButtonModule } from "primeng/button";

@Component({
  selector: 'app-home',
  imports: [
    LandingLayout,
    TranslatePipe,
    UpperCasePipe,
    ButtonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {

}
