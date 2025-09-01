import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardServiceModel } from '../../model/components/card-service.model';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from "primeng/button";

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

  @Input('props') props!: CardServiceModel.ICardService;

  constructor() { }


}
