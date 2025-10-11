import { Component } from '@angular/core';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";

@Component({
  selector: 'app-home',
  imports: [DshBaseLayout],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
