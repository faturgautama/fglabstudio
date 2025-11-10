import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  _http = inject(HttpClient);

  _userData = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("_CXUSER_") as string));

  signIn(email: string, password: string) {
    const payload = {
      email,
      password
    };

    return this._http.post(
      `${environment.SUPABASE_URL}/login`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      tap((result: any) => {
        if (result['user']) {
          localStorage.setItem("_CXUSER_", JSON.stringify(result));
          this._userData.next(result);
        }
      })
    )
  }

  signOut(user_id: number) {
    const payload = {
      user_id,
    };

    return this._http.post(
      `${environment.SUPABASE_URL}/logout`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
