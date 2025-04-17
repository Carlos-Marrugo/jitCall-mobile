import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonList, IonItem, IonAvatar, IonLabel, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { ContactosService } from 'src/app/core/services/contacto.service';
import { LlamadasService } from 'src/app/core/services/llamadas.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonAvatar, IonLabel, IonButton, IonIcon, CommonModule]
})
export class ListaContactosComponent {
  contactos$ = this.contactosService.obtenerContactos();

  constructor(
    private contactosService: ContactosService,
    private llamadasService: LlamadasService
  ) {}

  iniciarLlamada(contacto: any) {
    this.llamadasService.iniciarLlamada(contacto);
  }
}