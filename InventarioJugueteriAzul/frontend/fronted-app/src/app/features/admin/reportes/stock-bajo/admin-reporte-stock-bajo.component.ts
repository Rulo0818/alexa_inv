import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  stock_minimo: number;
  nombre_categoria: string;
  emoji_categoria?: string;
}

@Component({
  selector: 'app-admin-reporte-stock-bajo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reporte-stock-bajo.component.html',
  styleUrl: './admin-reporte-stock-bajo.component.css',
})
export class AdminReporteStockBajoComponent implements OnInit {
  umbral = signal(5);
  umbralInput = 5;
  loading = signal(false);
  productos = signal<Producto[]>([]);
  mensaje = signal<{ tipo: 'ok' | 'error'; text: string } | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.umbralInput = this.umbral();
    this.cargar();
  }

  cargar(): void {
    this.mensaje.set(null);
    this.loading.set(true);

    const u = Math.max(0, Math.floor(Number(this.umbralInput) || 0));
    this.umbral.set(u);
    this.umbralInput = u;

    this.api
      .get<{ success: boolean; umbral: number; productos: Producto[] }>('/api/reportes/stock-bajo', {
        umbral: String(u),
      })
      .subscribe({
        next: (res: any) => {
          const prods = Array.isArray(res) ? res : (res.productos ?? []);
          this.productos.set(prods);
          this.loading.set(false);
        },
        error: (e: any) => {
          this.productos.set([]);
          this.loading.set(false);
          this.mensaje.set({ tipo: 'error', text: e?.error?.message ?? 'Error al cargar el reporte' });
        },
      });
  }
}

