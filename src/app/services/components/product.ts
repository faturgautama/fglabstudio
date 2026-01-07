import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CardProductModel } from '../../model/components/card-product.model';

@Injectable({
  providedIn: 'root'
})
export class Product {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getProduct(): Observable<CardProductModel.ICardProduct[]> {
    return this._httpClient
      .get<CardProductModel.ICardProduct[]>('/assets/data/product.json')
      .pipe(
        map(result => result.filter(item => item.published_at))
      )
  }
}
