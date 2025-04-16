import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonList, IonItem, IonLabel, IonAvatar, IonNote, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { Contacto } from '../../models/contacto.model';
import { ContactosService } from 'src/app/core/services/contacto.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, IonAvatar, IonNote, IonButton, IonIcon]
})
export class ListaContactosComponent {
  contactos$ = this.contactosService.obtenerContactos();

  constructor(private contactosService: ContactosService) {}

  eliminarContacto(id: string) {
    this.contactosService.eliminarContacto(id).catch(error => {
      console.error('Error eliminando contacto:', error);
    });
  }
}