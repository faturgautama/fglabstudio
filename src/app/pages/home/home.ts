import { Component } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";

@Component({
  selector: 'app-home',
  imports: [LandingLayout],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {

}
