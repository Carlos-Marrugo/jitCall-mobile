import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { AutenticacionService } from '../core/services/autenticacion.service';
import { ListaContactosComponent } from '../contactos/components/lista-contactos/lista-contactos.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon,
    IonFab,
    IonFabButton,
    ListaContactosComponent
  ]
})
export class HomePage {
  constructor(private authService : AutenticacionService) {
    addIcons({ addOutline, logOutOutline });
  }
  logout() {
    this.authService.logout();
  }
}