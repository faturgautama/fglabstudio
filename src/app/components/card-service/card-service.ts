import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardServiceModel } from '../../model/components/card-service.model';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from "primeng/button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-service',
  imports: [
    TranslatePipe,
    Button
  ],
  standalone: true,
  templateUrl: './card-service.html',
  styleUrl: './card-service.scss'
})
export class CardService {

  @Input() props!: CardServiceModel.ICardService;

  constructor(private router: Router) { }

  handleLearnMore(): void {
    this.router.navigate(['/service'], { queryParams: { id: this.props.id } });
  }
}
