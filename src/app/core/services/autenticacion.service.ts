// src/app/core/services/autenticacion.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  async registrarUsuario(datosUsuario: any) {
    try {
      const credencial = await this.auth.createUserWithEmailAndPassword(
        datosUsuario.correo, 
        datosUsuario.contrasena
      );
      
      await this.firestore.collection('usuarios').doc(credencial.user?.uid).set({
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        telefono: datosUsuario.telefono
      });
      
      return credencial.user;
    } catch (error) {
      throw this.manejarErrorFirebase(error);
    }
  }

  private manejarErrorFirebase(error: any): string {
    return "An authentication error occurred."; 
  }

}