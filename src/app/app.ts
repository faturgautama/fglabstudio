import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button'
import { ToastModule, Toast } from 'primeng/toast'
import AOS from 'aos';
import { liveQuery } from 'dexie';
import { db } from './app.database';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('fglabstudio');

  ngOnInit(): void {
    AOS.init();

    liveQuery(() => db.employees
      .toArray())
      .subscribe((result) => {
        console.log("employee =>", result);
      })
  }
}
