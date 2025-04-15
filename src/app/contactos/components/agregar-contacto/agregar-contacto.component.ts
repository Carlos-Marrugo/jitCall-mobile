import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';
import { Contacto } from '../../models/contacto.model';
import { ContactosService } from 'src/app/core/services/contacto.service';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.component.html',
  styleUrls: ['./agregar-contacto.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonInput, IonItem, IonLabel, IonButton, IonIcon]
})
export class AgregarContactoComponent {
  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    email: ['', [Validators.email]]
  });

  constructor(
    private fb: FormBuilder,
    private contactosService: ContactosService,
    private toastCtrl: ToastController
  ) {}

  async agregarContacto() {
    if (this.formulario.valid) {
      try {
        const contacto: Omit<Contacto, 'id'> = {
          nombre: this.formulario.value.nombre!,
          apellido: this.formulario.value.apellido!,
          telefono: this.formulario.value.telefono!,
          email: this.formulario.value.email || undefined 
        };
        
        await this.contactosService.agregarContacto(contacto);
        await this.mostrarToast('Contacto agregado con éxito', 'success');
        this.formulario.reset();
      } catch (error) {
        await this.mostrarToast('Error al agregar contacto', 'danger');
        console.error('Error agregando contacto:', error);
      }
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
}