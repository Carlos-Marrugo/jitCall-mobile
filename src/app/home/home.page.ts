import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { ListaContactosComponent } from '../contactos/components/lista-contactos/lista-contactos.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonButton, IonIcon,
    ListaContactosComponent
  ]
})
export class HomePage {
  private auth = inject(Auth);
  private router = inject(Router);

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}