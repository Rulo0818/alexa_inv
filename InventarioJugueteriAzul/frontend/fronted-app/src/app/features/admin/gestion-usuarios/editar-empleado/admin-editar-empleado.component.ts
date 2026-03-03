import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { of, EMPTY, switchMap, timeout, catchError } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { environment } from '../../../../../environments/environment';

interface EmpleadoItem {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  edad?: number;
  telefono?: string;
  domicilio?: string;
  nombre_rol: string;
  activo: boolean;
  foto_url?: string | null;
}

@Component({
  selector: 'app-admin-editar-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-editar-empleado.component.html',
  styleUrl: './admin-editar-empleado.component.css',
})
export class AdminEditarEmpleadoComponent implements OnInit {
  id: number | null = null;
  nombre = '';
  apellido = '';
  edad: number | null = null;
  telefono = '';
  domicilio = '';
  activo = true;
  username = '';
  nombreRol = '';
  fotoUrl: string | null = null;
  fotoPreview: string | null = null;
  fotoFile: File | null = null;
  error = '';
  loading = false;
  loadingStep: 'datos' | 'foto' | null = null;
  loadingData = true;
  notFound = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? parseInt(idParam, 10) : null;
    if (!this.id || isNaN(this.id)) {
      this.error = 'ID inválido';
      this.notFound = true;
      this.loadingData = false;
      return;
    }
    const state = history.state?.empleado as EmpleadoItem | undefined;
    if (state && state.id === this.id) {
      this.aplicarDatos(state);
      this.loadingData = false;
    }
    this.cargarEmpleado();
  }

  private aplicarDatos(e: EmpleadoItem): void {
    this.nombre = e.nombre ?? '';
    this.apellido = e.apellido ?? '';
    this.edad = e.edad ?? null;
    this.telefono = e.telefono ?? '';
    this.domicilio = e.domicilio ?? '';
    this.activo = e.activo ?? true;
    this.username = e.username ?? '';
    this.nombreRol = e.nombre_rol ?? '';
    this.fotoUrl = e.foto_url ? `${environment.apiUrl}/uploads/${e.foto_url}` : null;
  }

  cargarEmpleado(): void {
    if (!this.id) return;
    this.api
      .get<{ empleado: EmpleadoItem }>('/api/empleados/' + this.id)
      .pipe(
        timeout(8000),
        catchError((err) => {
          if (this.loadingData) {
            this.error = err?.name === 'TimeoutError'
              ? 'Tiempo de espera agotado. Verifica que el backend esté corriendo.'
              : (err?.error?.message ?? err?.message ?? 'Empleado no encontrado');
            this.notFound = true;
            this.loadingData = false;
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: (res: any) => {
          const e = res?.empleado;
          if (e) this.aplicarDatos(e);
        },
        error: (err) => {
          if (this.loadingData) {
            this.error = err?.error?.message ?? 'Empleado no encontrado';
            this.notFound = true;
            this.loadingData = false;
          }
        },
        complete: () => {
          this.loadingData = false;
        },
      });
  }

  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.error = 'La imagen no debe superar 2MB';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      this.error = 'Solo se permiten JPG, PNG o WebP';
      return;
    }
    this.fotoFile = file;
    this.error = '';
    const reader = new FileReader();
    reader.onload = () => (this.fotoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarFoto(): void {
    this.fotoPreview = null;
    this.fotoFile = null;
  }

  fotoDisplayUrl(): string | null {
    return this.fotoPreview ?? this.fotoUrl;
  }

  enviar(): void {
    this.error = '';
    if (!this.id) return;
    if (!this.nombre?.trim() || !this.apellido?.trim()) {
      this.error = 'Nombre y apellido son requeridos';
      return;
    }

    this.loading = true;
    this.loadingStep = this.fotoFile ? 'datos' : null;
    const edadVal = this.edad;
    const edadNum = (edadVal != null && String(edadVal).trim() !== '' && !isNaN(Number(edadVal)))
      ? Number(edadVal) : undefined;
    const activoBool = this.activo === true || (this.activo as unknown) === 'true';
    const body = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      edad: edadNum,
      telefono: (this.telefono ?? '').trim() || undefined,
      domicilio: (this.domicilio ?? '').trim() || undefined,
      activo: activoBool,
    };

    this.api
      .put<{ success: boolean; message?: string }>('/api/empleados/' + this.id, body)
      .pipe(
        switchMap((res) => {
          if (!res?.success) throw new Error(res?.message ?? 'Error al actualizar');
          if (this.fotoFile) {
            this.loadingStep = 'foto';
            const fd = new FormData();
            fd.append('foto', this.fotoFile);
            return this.api.postFormData<{ success: boolean }>(
              `/api/empleados/${this.id}/foto`,
              fd
            );
          }
          return of(res);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/admin/gestion-usuarios']),
        error: (err) => {
          this.error = err?.error?.message ?? err?.message ?? 'Error al actualizar empleado';
          this.loading = false;
          this.loadingStep = null;
        },
        complete: () => {
          this.loading = false;
          this.loadingStep = null;
        },
      });
  }
}
