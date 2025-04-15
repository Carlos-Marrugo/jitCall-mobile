import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Contacto } from 'src/app/contactos/models/contacto.model';
import { ToastController, LoadingController } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class ContactosService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);
    private toastCtrl = inject(ToastController);
    private loadingCtrl = inject(LoadingController);

    constructor() {}

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
        if (error.code === 'unavailable') {
            return 'Sin conexión a Internet. Por favor verifica tu conexión';
        }
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

    obtenerContactos(): Observable<Contacto[]> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) throw new Error('No has iniciado sesion');

        const contactosRef = collection(this.firestore, `usuarios/${userId}/contactos`);
        return collectionData(contactosRef, { idField: 'id' }) as Observable<Contacto[]>;
    }

    agregarContacto(contacto: Omit<Contacto, 'id'>) {
        const userId = this.auth.currentUser?.uid;
        if (!userId) throw new Error('No has iniciado sesion');

        const nuevoDoc = doc(collection(this.firestore, `usuarios/${userId}/contactos`));
        return from(setDoc(nuevoDoc, { ...contacto, fechaCreacion: new Date().toISOString() }));
    }

    async buscarYAgregarContacto(telefono: string) {
        const loading = await this.mostrarCarga('Buscando contacto...');
        try {
            // 1. Buscar en todos los usuarios
            const usuariosRef = collection(this.firestore, 'usuarios');
            const q = query(usuariosRef, where('telefono', '==', telefono));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                throw new Error('No se encontró usuario con ese teléfono');
            }
        
            // 2. Agregar a mis contactos
            const userId = this.auth.currentUser?.uid;
            if (!userId) throw new Error('Usuario no autenticado');
            
            const contactoData = querySnapshot.docs[0].data();
            await setDoc(doc(this.firestore, `usuarios/${userId}/contactos`, querySnapshot.docs[0].id), {
                nombre: contactoData['nombre'],
                apellido: contactoData['apellido'],
                telefono: contactoData['telefono'],
                email: contactoData['email'] || '',
                fechaAgregado: new Date().toISOString()
            });
        
            await this.mostrarToast('Contacto agregado con éxito', 'success');
        } catch (error) {
            await this.mostrarToast(this.manejarErrorFirebase(error), 'danger');
            throw error;
        } finally {
            await loading.dismiss();
        }
    }

    eliminarContacto(id: string) {
        const userId = this.auth.currentUser?.uid;
        if (!userId) throw new Error('Usuario no autenticado');

        return from(deleteDoc(doc(this.firestore, `usuarios/${userId}/contactos/${id}`)));
    }
}