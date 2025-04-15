import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonTabs, 
  IonTabBar, 
  IonTabButton,
  IonIcon,
  IonLabel 
} from '@ionic/angular/standalone';
import { ListaContactosComponent } from '../../components/lista-contactos/lista-contactos.component';
import { AgregarContactoComponent } from '../../components/agregar-contacto/agregar-contacto.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-contactos',
  templateUrl: './gestion-contactos.page.html',
  styleUrls: ['./gestion-contactos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonTabBar, IonTabButton,
    ListaContactosComponent, AgregarContactoComponent, IonIcon, IonLabel,
  ]
})
export class GestionContactosPage {
  activeTab = 'lista';
}