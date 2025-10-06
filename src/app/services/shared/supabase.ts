import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabase_url, environment.supabase_key);
  }
}
