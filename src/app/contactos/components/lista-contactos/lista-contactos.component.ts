import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, IonAvatar, IonNote, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ContactosService } from 'src/app/core/services/contacto.service';


@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CommonModule, IonList, IonItem, IonLabel, IonAvatar, IonNote, IonButton, IonIcon]
})
export class ListaContactosComponent implements OnInit {
  contactos$ = this.contactosService.obtenerContactos();

  constructor(private contactosService: ContactosService) {}

  ngOnInit() {}

  eliminarContacto(id: string) {
    this.contactosService.eliminarContacto(id).subscribe({
      next: () => console.log('Contacto eliminado'),
      error: (err) => console.error('Error eliminando contacto', err)
    });
  }
}