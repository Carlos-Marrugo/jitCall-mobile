import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, query, where, DocumentData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, from, map, switchMap } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private toastCtrl: ToastController
  ) {}

  obtenerContactos(): Observable<any[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return from([]);
        
        const contactosRef = collection(this.firestore, `users/${user.uid}/contacts`);
        const q = query(contactosRef);
        
        return from(getDocs(q)).pipe(
          map(querySnapshot => 
            querySnapshot.docs.map(doc => {
              const data = doc.data();
              return { 
                id: doc.id, 
                ...this.convertToObject(data),
                fcmToken: data['fcmToken'] || null
              };
            })
          )
        );
      })
    );
  }

  async buscarYAgregarContacto(telefono: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      // 1. Buscar usuario por teléfono
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('telefono', '==', telefono));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await this.mostrarToast('No se encontró usuario con ese teléfono', 'warning');
        return false;
      }

      const contactoDoc = querySnapshot.docs[0];
      if (contactoDoc.id === user.uid) {
        await this.mostrarToast('No puedes agregarte a ti mismo', 'warning');
        return false;
      }

      const contactoData = this.convertToObject(contactoDoc.data());

      // 2. Verificar si ya es contacto
      const contactoExistenteQuery = query(
        collection(this.firestore, `users/${user.uid}/contacts`), 
        where('telefono', '==', telefono)
      );
      const contactoExistenteSnapshot = await getDocs(contactoExistenteQuery);

      if (!contactoExistenteSnapshot.empty) {
        await this.mostrarToast('Este contacto ya existe', 'warning');
        return false;
      }

      // 3. Agregar contacto
      const contactoRef = doc(this.firestore, `users/${user.uid}/contacts`, contactoDoc.id);
      await setDoc(contactoRef, {
        ...contactoData,
        userId: contactoDoc.id,
        fechaAgregado: new Date().toISOString()
      });

      await this.mostrarToast('Contacto agregado con éxito', 'success');
      return true;

    } catch (error) {
      console.error('Error agregando contacto:', error);
      await this.mostrarToast('Error al agregar contacto', 'danger');
      return false;
    }
  }

  private convertToObject(data: DocumentData): any {
    return JSON.parse(JSON.stringify(data));
  }

  private async getCurrentUser() {
    return new Promise<any>((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      });
    });
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
}