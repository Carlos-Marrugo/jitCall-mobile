import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './auth/login/login.page';
import { RegistroPage } from './auth/registro/registro.page';
import { HomePage } from './home/home.page';
import { GestionContactosPage } from './contactos/pages/gestion-contactos/gestion-contactos.page';
import { AgregarContactoComponent } from './contactos/components/agregar-contacto/agregar-contacto.component';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { 
    path: 'home', 
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'agregar-contacto',
        component: AgregarContactoComponent
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
