import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button'
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
export class App {
  protected readonly title = signal('fglabstudio');
}
