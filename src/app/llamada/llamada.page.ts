import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.page.html',
  styleUrls: ['./llamada.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class LlamadaPage implements OnInit, OnDestroy {
  meetingId!: string;
  esIniciador!: boolean;
  nombreContacto!: string;
  jitsiUrl!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.meetingId = state['meetingId'];
      this.esIniciador = state['esIniciador'];
      this.nombreContacto = state['nombreContacto'] || 'Participante';
      
      this.iniciarLlamada();
    }
  }

  async iniciarLlamada() {
    const serverUrl = 'https://meet.jit.si';
    this.jitsiUrl = `${serverUrl}/jitCall-${this.meetingId}`;
    
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: this.jitsiUrl });
    } else {
      window.open(this.jitsiUrl, '_blank');
    }
  }

  finalizarLlamada() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    // Limpieza si es necesario
  }
}