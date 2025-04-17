import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController, LoadingController } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
  useFactory: (auth: Auth, firestore: Firestore, router: Router, toastCtrl: ToastController, loadingCtrl: LoadingController, http: HttpClient) => 
    new AutenticacionService(auth, firestore, router, toastCtrl, loadingCtrl, http),
  deps: [Auth, Firestore, Router, ToastController, LoadingController, HttpClient]
})
export class AutenticacionService {
  constructor(
    private auth = inject(Auth),
  private firestore = inject(Firestore),
  private router = inject(Router),
  private toastCtrl = inject(ToastController),
  private loadingCtrl = inject(LoadingController),
  private http = inject(HttpClient),
    
  ) {}

  async loginAPIExterna(email: string, password: string): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ token: string }>(
          'https://ravishing-courtesy-production.up.railway.app/user/login',
          { email, password }
        )
      );
      await Preferences.set({ key: 'apiToken', value: response.token });
    } catch (error) {
      console.error('Error en login API externa:', error);
      throw error;
    }
  }

  async registrarUsuario(datos: any) {
    try {
      // 1. Registrar en Authentication
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        datos.correo,
        datos.contrasena
      );

      // 2. Guardar en Firestore
      await setDoc(doc(this.firestore, 'users', credencial.user.uid), {
        uid: credencial.user.uid,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        email: datos.correo,
        fechaRegistro: new Date().toISOString()
      });

      // 3. Redirigir
      this.router.navigate(['/home']);
      await this.mostrarToast('Registro exitoso!', 'success');
      
    } catch (error: any) {
      let mensaje = 'Error desconocido';
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'El correo ya está registrado';
          break;
        case 'auth/invalid-email':
          mensaje = 'Correo inválido';
          break;
        case 'auth/weak-password':
          mensaje = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'permission-denied':
          mensaje = 'Error de permisos. Contacta al administrador';
          break;
      }
      
      await this.mostrarToast(mensaje, 'danger');
      throw error;
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }


  private manejarError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use': return 'El correo ya está registrado';
      case 'auth/invalid-email': return 'Correo inválido';
      case 'auth/weak-password': return 'Contraseña débil (mínimo 6 caracteres)';
      case 'auth/user-not-found': return 'Usuario no encontrado';
      case 'auth/wrong-password': return 'Contraseña incorrecta';
      default: return 'Error desconocido';
    }
  }

  async estaAutenticado(): Promise<boolean> {
    const user = this.auth.currentUser;
    return !!user;
  }

  async logout() {
    await signOut(this.auth);
    await Preferences.remove({ key: 'userData' });
    this.router.navigate(['/login']);
  }

  
  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    try {
      const credencial = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Guardar datos en Storage
      await Preferences.set({
        key: 'userData',
        value: JSON.stringify({
          uid: credencial.user.uid,
          email: email
        })
      });

      this.router.navigate(['/home']);
      await this.mostrarToast('Bienvenido!', 'success');
    } catch (error: any) {
      await this.mostrarToast(this.manejarError(error), 'danger');
      throw error;
    } finally {
      await loading.dismiss();
    }
  }
}