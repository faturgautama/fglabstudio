import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-badge-title',
  standalone: true,
  imports: [],
  templateUrl: './badge-title.html',
  styleUrl: './badge-title.scss'
})
export class BadgeTitle {

  @Input('title') title: string = "";
}
