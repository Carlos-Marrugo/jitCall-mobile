import { ToastController } from '@ionic/angular/standalone';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en login:', error);
      throw this.manejarErrorFirebase(error);
    }
  }

  async registrarUsuario(datos: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    contrasena: string;
  }): Promise<void> {
    try {
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        datos.correo,
        datos.contrasena
      );
      
      if (credencial.user) {
        await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), {
          nombre: datos.nombre,
          apellido: datos.apellido,
          telefono: datos.telefono,
          correo: datos.correo,
          uid: credencial.user.uid
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw this.manejarErrorFirebase(error);
    }
  }


  async estaAutenticado(): Promise<boolean> {
    const user = await firstValueFrom(authState(this.auth));
    return !!user;
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

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
