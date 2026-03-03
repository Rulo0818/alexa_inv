import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

interface StatsInventario {
  total_productos: number;
  valor_inventario: number;
  stock_bajo: number;
  agotados: number;
}

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-inventario.component.html',
  styleUrl: './admin-inventario.component.css',
})
export class AdminInventarioComponent implements OnInit {
  stats = signal<StatsInventario | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarStats();
  }

  private cargarStats(): void {
    this.api.get<{ estadisticas: StatsInventario }>('/api/productos/estadisticas/inventario').subscribe({
      next: (res) => this.stats.set(res.estadisticas ?? null),
      error: () => {},
    });
  }

  formatMoney(n: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  }
}
