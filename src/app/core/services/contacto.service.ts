import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { Contacto } from 'src/app/contactos/models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private toastCtrl = inject(ToastController);

  obtenerContactos(): Observable<Contacto[]> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('Usuario no autenticado');
    
    const contactosRef = collection(this.firestore, `usuarios/${userId}/contactos`);
    return collectionData(contactosRef, { idField: 'id' }) as Observable<Contacto[]>;
  }

  async agregarContacto(contacto: Omit<Contacto, 'id'>) {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('Usuario no autenticado');

    const nuevoDoc = doc(collection(this.firestore, `usuarios/${userId}/contactos`));
    await setDoc(nuevoDoc, { ...contacto, fechaCreacion: new Date().toISOString() });
    await this.mostrarToast('Contacto agregado!', 'success');
  }

  async buscarYAgregarContacto(telefono: string) {
    try {
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('telefono', '==', telefono));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No se encontró usuario con ese teléfono');
      }

      const userId = this.auth.currentUser?.uid;
      if (querySnapshot.docs[0].id === userId) {
        throw new Error('No puedes agregarte a ti mismo');
      }

      const contactoData = querySnapshot.docs[0].data();
      await this.agregarContacto({
        nombre: contactoData['nombre'],
        apellido: contactoData['apellido'],
        telefono: contactoData['telefono'],
        email: contactoData['email'],
        userId: querySnapshot.docs[0].id 
      });

    } catch (error: any) {
      await this.mostrarToast(error.message, 'danger');
      throw error;
    }
  }

  async eliminarContacto(id: string) {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('Usuario no autenticado');

    await deleteDoc(doc(this.firestore, `usuarios/${userId}/contactos/${id}`));
    await this.mostrarToast('Contacto eliminado', 'success');
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}