import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardServiceModel } from '../../model/components/card-service.model';

@Component({
  selector: 'app-card-service',
  imports: [],
  standalone: true,
  templateUrl: './card-service.html',
  styleUrl: './card-service.scss'
})
export class CardService {

  @Input('props') props!: CardServiceModel.ICardService;

  constructor() { }


}
