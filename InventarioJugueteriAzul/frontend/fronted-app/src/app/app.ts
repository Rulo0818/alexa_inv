import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppFooterComponent } from './core/components/app-footer/app-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fronted-app');
}
