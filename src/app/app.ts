import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button'
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('fglabstudio');

  ngOnInit(): void {
    AOS.init();
  }
}
