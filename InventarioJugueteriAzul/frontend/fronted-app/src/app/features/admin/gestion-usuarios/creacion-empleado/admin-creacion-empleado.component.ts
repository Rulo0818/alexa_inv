import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { of, EMPTY, switchMap, catchError } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-admin-creacion-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-creacion-empleado.component.html',
  styleUrl: './admin-creacion-empleado.component.css',
})
export class AdminCreacionEmpleadoComponent {
  nombre = '';
  apellido = '';
  edad: number | null = null;
  telefono = '';
  domicilio = '';
  contrasena_temporal = '';
  id_rol = 2;
  activo = true;
  error = '';
  loading = false;
  loadingStep: 'datos' | 'foto' | null = null;
  fotoPreview: string | null = null;
  fotoFile: File | null = null;

  usernamePreview = computed(() => {
    const n = this.nombre.trim().toLowerCase().replace(/\s+/g, '_');
    const a = this.apellido.trim().toLowerCase().replace(/\s+/g, '_');
    if (!n || !a) return 'Ingresa nombre y apellido';
    const sufijo = this.id_rol === 1 ? 'AJA' : 'EJA';
    return n + '_' + a + sufijo;
  });

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.error = 'La imagen no debe superar 2MB';
      return;
    }
    const valid = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
    if (!valid) {
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

  enviar(): void {
    this.error = '';
    if (!this.nombre.trim() || !this.apellido.trim()) {
      this.error = 'Nombre y apellido son requeridos';
      return;
    }
    if (!this.contrasena_temporal || this.contrasena_temporal.length < 6) {
      this.error = 'La contraseña temporal debe tener mínimo 6 caracteres';
      return;
    }
    if (this.id_rol !== 1 && this.id_rol !== 2) {
      this.error = 'Selecciona un rol válido';
      return;
    }

    this.loading = true;
    this.loadingStep = this.fotoFile ? 'datos' : null;
    const idRolNum = Number(this.id_rol);
    const activoBool = this.activo === true || (this.activo as unknown) === 'true';
    const edadVal = this.edad;
    const edadNum = (edadVal != null && String(edadVal).trim() !== '' && !isNaN(Number(edadVal)))
      ? Number(edadVal) : undefined;
    const body: Record<string, unknown> = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      edad: edadNum,
      telefono: (this.telefono ?? '').trim() || undefined,
      domicilio: (this.domicilio ?? '').trim() || undefined,
      contrasena_temporal: this.contrasena_temporal,
      id_rol: idRolNum,
      activo: activoBool,
    };

    this.api
      .post<{ success: boolean; message?: string; username?: string; empleado_id?: number }>(
        '/api/empleados',
        body
      )
      .pipe(
        switchMap((res) => {
          if (!res?.success || !res.empleado_id) {
            throw new Error(res?.message ?? 'Error al crear empleado');
          }
          if (this.fotoFile) {
            this.loadingStep = 'foto';
            const fd = new FormData();
            fd.append('foto', this.fotoFile);
            return this.api.postFormData<{ success: boolean }>(
              `/api/empleados/${res.empleado_id}/foto`,
              fd
            ).pipe(
              catchError(() => of({ success: true }))
            );
          }
          return of(res);
        }),
        catchError((err) => {
          this.error = err?.error?.message ?? err?.message ?? 'Error al crear empleado';
          this.loading = false;
          this.loadingStep = null;
          return EMPTY;
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/admin/gestion-usuarios']),
        error: (err) => {
          this.error = err?.error?.message ?? err?.message ?? 'Error al crear empleado';
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
