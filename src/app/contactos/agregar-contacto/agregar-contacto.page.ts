import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactosService } from '../../core/services/contacto.service';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, 
  IonInput, IonItem, IonLabel, IonToast, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.page.html',
  styleUrls: ['./agregar-contacto.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonInput, IonItem, IonLabel, IonToast, IonIcon,
    ReactiveFormsModule
  ]
})
export class AgregarContactoPage {
  formulario = this.fb.group({
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private contactosService: ContactosService
  ) {
    addIcons({ arrowBack });
  }
  volverAtras() {
    this.router.navigate(['/home']);
  }

  async agregarContacto() {
    if (this.formulario.valid) {
      const telefono = this.formulario.value.telefono!;
      const exito = await this.contactosService.buscarYAgregarContacto(telefono);
      
      if (exito) {
        this.formulario.reset();
        setTimeout(() => this.router.navigate(['/home']), 1500);
      }
    }
  }
}