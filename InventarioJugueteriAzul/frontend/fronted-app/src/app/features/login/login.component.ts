import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.pattern(/^.+_.+(EJA|AJA)$/i)]],
      contrasena: ['', Validators.required],
      recordar: [false],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const body: LoginRequest = {
      username: value.username.trim(),
      contrasena: value.contrasena,
    };
    this.loading = true;
    this.auth.login(body, !!value.recordar).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          const rol = (res.usuario?.nombre_rol ?? '').toLowerCase();
          this.router.navigate([rol === 'jefe' ? '/admin' : '/empleado']);
        } else {
          this.errorMessage = res.message || 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error de conexión. Verifica que el backend esté en marcha.';
      },
    });
  }
}
