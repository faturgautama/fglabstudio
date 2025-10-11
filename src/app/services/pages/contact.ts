import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactModel } from '../../model/pages/contact.model';
import { Supabase } from '../shared/supabase';
import { from, switchMap, tap } from 'rxjs';
import { Location } from '../shared/location';

@Injectable({
  providedIn: 'root'
})
export class Contact {
  _httpClient = inject(HttpClient);
  _supabaseClient = inject(Supabase);
  _locationService = inject(Location);

  submitForm(payload: ContactModel.Submit) {
    const location$ = this._locationService.getLocation();

    const submit$ = location$.pipe(
      switchMap((location: any) =>
        from(
          this._supabaseClient.client
            .from('contact')
            .insert([
              {
                full_name: payload.full_name,
                email: payload.email,
                phone_number: payload.phone_number,
                subject: "",
                content: payload.content,
                ip_address: location.ip,
                city: location.city,
                region: location.region,
                country: location.country,
                longitude: location.longitude,
                latitude: location.latitude,
                created_at: new Date(),
              }
            ])
        )
      )
    )

    return submit$;
  }
}
