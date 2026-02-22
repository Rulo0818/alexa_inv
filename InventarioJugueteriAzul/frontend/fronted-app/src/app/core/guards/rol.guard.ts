import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolRequerido = (route.data['rol'] as string)?.toLowerCase();
  const rolUsuario = (auth.currentUser()?.nombre_rol ?? '').toLowerCase();

  if (rolRequerido && rolUsuario && rolUsuario !== rolRequerido) {
    router.navigate([rolUsuario === 'jefe' ? '/admin' : '/empleado']);
    return false;
  }
  return true;
};
