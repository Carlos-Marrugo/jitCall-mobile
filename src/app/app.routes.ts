import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './auth/login/login.page';
import { RegistroPage } from './auth/registro/registro.page';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { 
    path: 'home', 
    component: HomePage,
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
