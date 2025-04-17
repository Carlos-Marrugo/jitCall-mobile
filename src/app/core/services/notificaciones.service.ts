import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NotificationData } from 'src/app/contactos/models/notification.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private readonly API_URL = 'https://ravishing-courtesy-production.up.railway.app';

  async initPushNotifications() {
    const status = await PushNotifications.requestPermissions();
    if (status.receive === 'granted') {
      await PushNotifications.register();

      // Guardar token FCM en Firestore
      PushNotifications.addListener('registration', async (token) => {
        const user = this.auth.currentUser;
        if (user) {
          await updateDoc(doc(this.firestore, 'users', user.uid), {
            fcmToken: token.value
          });
        }
      });

      // Manejar notificaciones recibidas
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida:', notification);
      });
    }
  }

  async enviarNotificacionLlamada(data: {
    token: string;
    meetingId: string;
    nombre: string;
    userId: string;
  }): Promise<void> {
    try {
      const payload = {
        token: data.token,
        notification: {
          title: "Llamada entrante",
          body: `${data.nombre} te está llamando`
        },
        android: {
          priority: "high",
          data: {
            userId: data.userId,
            meetingId: data.meetingId,
            type: "incoming_call",
            name: data.nombre,
            userFrom: this.auth.currentUser?.uid
          }
        }
      };

      await lastValueFrom(
        this.http.post(`${this.API_URL}/notifications`, payload)
      );
    } catch (error) {
      console.error('Error enviando notificación:', error);
      throw error;
    }
  }

  private async obtenerApiToken(): Promise<string> {
    // Simplificado (el interceptor manejará el token)
    const response = await lastValueFrom(
      this.http.post<{ token: string }>(`${this.API_URL}/user/login`, {
        email: 'tu_correo@institucional.edu',
        password: 'tu_contraseña'
      })
    );
    await Preferences.set({ key: 'apiToken', value: response.token });
    return response.token;
  }}