import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css',
})
export class AppFooterComponent {
  readonly systemName = 'Inventario Juguetería Azul';
  readonly currentYear = new Date().getFullYear();
}
