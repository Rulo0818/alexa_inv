import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolGuard } from './core/guards/rol.guard';
import { LoginComponent } from './features/login/login.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminInventarioComponent } from './features/admin/admin-inventario/admin-inventario.component';
import { AdminInventarioListComponent } from './features/admin/admin-inventario/admin-inventario-list/admin-inventario-list.component';
import { AdminCategoriasComponent } from './features/admin/admin-inventario/categorias/admin-categorias.component';
import { AdminAgregarProductoComponent } from './features/admin/admin-inventario/agregar-producto/admin-agregar-producto.component';
import { AdminEditarProductoComponent } from './features/admin/admin-inventario/editar-producto/admin-editar-producto.component';
import { AdminHistorialVentasComponent } from './features/admin/historial-ventas/admin-historial-ventas.component';
import { AdminHistorialAccionesComponent } from './features/admin/historial-acciones/admin-historial-acciones.component';
import { AdminGestionUsuariosComponent } from './features/admin/gestion-usuarios/admin-gestion-usuarios.component';
import { AdminCreacionEmpleadoComponent } from './features/admin/gestion-usuarios/creacion-empleado/admin-creacion-empleado.component';
import { AdminEditarEmpleadoComponent } from './features/admin/gestion-usuarios/editar-empleado/admin-editar-empleado.component';
import { AdminNuevaVentaComponent } from './features/admin/nueva-venta/admin-nueva-venta.component';
import { EmpleadoComponent } from './features/empleado/empleado.component';
import { RecuperarComponent } from './features/recuperar/recuperar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, rolGuard],
    data: { rol: 'jefe' },
    children: [
      { path: '', component: AdminDashboardComponent },
      {
        path: 'inventario',
        component: AdminInventarioComponent,
        children: [
          { path: '', component: AdminInventarioListComponent },
          { path: 'categorias', component: AdminCategoriasComponent },
          { path: 'agregar-producto', component: AdminAgregarProductoComponent },
          { path: 'editar-inventario/:id', component: AdminEditarProductoComponent },
        ],
      },
      { path: 'ventas', component: AdminNuevaVentaComponent },
      { path: 'historial-ventas', component: AdminHistorialVentasComponent },
      { path: 'historial-acciones', component: AdminHistorialAccionesComponent },
      { path: 'gestion-usuarios', component: AdminGestionUsuariosComponent },
      { path: 'gestion-usuarios/creacion-empleado', component: AdminCreacionEmpleadoComponent },
      { path: 'gestion-usuarios/editar-usuario/:id', component: AdminEditarEmpleadoComponent },
    ],
  },
  { path: 'empleado', component: EmpleadoComponent, canActivate: [authGuard, rolGuard], data: { rol: 'empleado' } },
  { path: '**', redirectTo: 'login' },
];
