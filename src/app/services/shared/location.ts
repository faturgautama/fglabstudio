import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Location {
  
  _httpClient = inject(HttpClient);

  getLocation() {
    return this._httpClient.get('https://ipapi.co/json/');
  }
}
