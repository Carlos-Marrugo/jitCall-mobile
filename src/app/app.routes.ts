import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './auth/login/login.page';
import { RegistroPage } from './auth/registro/registro.page';
import { HomePage } from './home/home.page';
import { GestionContactosPage } from './contactos/pages/gestion-contactos/gestion-contactos.page';
import { AgregarContactoComponent } from './contactos/components/agregar-contacto/agregar-contacto.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'llamada',
    loadComponent: () => import('./llamada/llamada.page').then(m => m.LlamadaPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'agregar-contacto',
    loadComponent: () => import('./contactos/agregar-contacto/agregar-contacto.page').then(m => m.AgregarContactoPage),
    canActivate: [AuthGuard]
  }

];
