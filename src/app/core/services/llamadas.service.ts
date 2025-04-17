import { Injectable, inject } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Contacto } from 'src/app/contactos/models/notification.model';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlamadasService {
  // Servicios inyectados
  private notificaciones = inject(NotificacionesService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private readonly API_URL = 'https://ravishing-courtesy-production.up.railway.app';

  async iniciarLlamada(contacto: Contacto) {
    const meetingId = uuidv4();
    
    if (!contacto.fcmToken) {
      throw new Error('El contacto no tiene token FCM registrado');
    }

    await this.notificaciones.enviarNotificacionLlamada({
      token: contacto.fcmToken,
      meetingId: meetingId,
      nombre: `${contacto.nombre} ${contacto.apellido}`,
      userId: contacto.userId
    });

    try {
      await lastValueFrom(
        this.http.post(`${this.API_URL}/calls`, {
          meetingId,
          callerId: this.auth.currentUser?.uid,
          receiverId: contacto.userId
        })
      );
    } catch (error) {
      console.error('Error registrando llamada:', error);
    }

    this.router.navigate(['/llamada'], {
      state: { 
        meetingId,
        esIniciador: true,
        nombreContacto: `${contacto.nombre} ${contacto.apellido}`
      }
    });
  }
}