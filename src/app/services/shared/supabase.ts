import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }
}
