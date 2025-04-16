import { Component } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { ListaContactosComponent } from '../contactos/components/lista-contactos/lista-contactos.component';
import { Router } from '@angular/router';
import { AutenticacionService } from '../core/services/autenticacion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonFab, IonFabButton,
    ListaContactosComponent
  ]
})
export class HomePage {
  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  async logout() {
    await this.authService.logout();
  }

  navegarAGestionContactos() {
    this.router.navigate(['/gestion-contactos']);
  }
}