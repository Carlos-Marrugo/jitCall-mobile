import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private readonly API_URL = 'https://ravishing-courtesy-production.up.railway.app';

  constructor() {}

  async initPushNotifications() {
    try {
      const status = await PushNotifications.requestPermissions();
      
      if (status.receive === 'granted') {
        await PushNotifications.register();
        
        PushNotifications.addListener('registration', async (token) => {
          const user = this.auth.currentUser;
          if (user) {
            await updateDoc(doc(this.firestore, 'users', user.uid), {
              fcmToken: token.value
            });
          }
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notificación recibida:', notification);
        });
      }
    } catch (error) {
      console.error('Error en notificaciones:', error);
    }
  }

  async enviarNotificacionLlamada(destinatarioId: string): Promise<string> {
    try {
      const destinatarioDoc = await getDoc(doc(this.firestore, 'users', destinatarioId));
      const tokenDestino = destinatarioDoc.data()?.['fcmToken'];
      
      if (!tokenDestino) throw new Error('El usuario no tiene token FCM');

      const meetingId = this.generarMeetingId();
      const apiToken = await this.obtenerApiToken();

      await lastValueFrom(
        this.http.post(`${this.API_URL}/notifications`, {
          token: tokenDestino,
          notification: {
            title: "Llamada entrante",
            body: "Tienes una llamada entrante"
          },
          android: {
            priority: "high",
            data: {
              userId: destinatarioId,
              meetingId: meetingId,
              type: "incoming_call",
              name: "Usuario",
              userFrom: this.auth.currentUser?.uid
            }
          }
        }, {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${apiToken}`
          })
        })
      );

      return meetingId;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      throw error;
    }
  }

  private generarMeetingId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async obtenerApiToken(): Promise<string> {
    // Implementación temporal - reemplaza con tu lógica real
    return 'tu_token_de_api';
  }
}