import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  private _router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this._router.navigateByUrl("/people/home");
    }, 100);
  }
}
