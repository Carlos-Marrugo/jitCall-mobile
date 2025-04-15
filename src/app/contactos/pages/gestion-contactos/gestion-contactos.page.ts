import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-gestion-contactos',
  templateUrl: './gestion-contactos.page.html',
  styleUrls: ['./gestion-contactos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GestionContactosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
