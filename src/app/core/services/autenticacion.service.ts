// src/app/core/services/autenticacion.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, enableNetwork  } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  public async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  private async mostrarCarga(mensaje: string): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  private manejarErrorFirebase(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'El correo ya está registrado';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      default:
        return 'Ocurrió un error inesperado';
    }
  }

  async verificarUsuarioExistente(correo: string): Promise<boolean> {
    const query = await getDoc(doc(this.firestore, 'usuarios', correo));
    return query.exists();
  }

  async registrarUsuario(datos: any): Promise<void> {
    const loading = await this.mostrarCarga('Registrando usuario...');
    
    try {
      // Forzar conexión de red
      await enableNetwork(this.firestore);
      
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        datos.correo,
        datos.contrasena
      );

      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), {
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        correo: datos.correo,
        uid: credencial.user.uid,
        fechaRegistro: new Date().toISOString()
      });

      await this.mostrarToast('¡Registro exitoso!', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error Firestore:', error);
      await this.mostrarToast(this.manejarErrorFirebase(error), 'danger');
      throw error;
    } finally {
      await loading.dismiss();
    }
  }

  async login(email: string, password: string): Promise<void> {
    const loading = await this.mostrarCarga('Iniciando sesión...');
    
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.mostrarToast('¡Bienvenido!', 'success');
      this.router.navigate(['/home']);
    } catch (error) {
      await this.mostrarToast(this.manejarErrorFirebase(error), 'danger');
      throw error;
    } finally {
      await loading.dismiss();
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async estaAutenticado(): Promise<boolean> {
    const user = await firstValueFrom(authState(this.auth));
    return !!user;
  }
}