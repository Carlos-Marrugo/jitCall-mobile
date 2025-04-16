import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonInput, IonItem, IonLabel, IonButton, IonIcon 
} from '@ionic/angular/standalone';
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
    telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
  });

  constructor(
    private fb: FormBuilder,
    private contactosService: ContactosService
  ) {}

  async agregarContacto() {
    if (this.formulario.valid) {
      try {
        await this.contactosService.buscarYAgregarContacto(this.formulario.value.telefono!);
        this.formulario.reset();
      } catch (error) {
        console.error('Error agregando contacto:', error);
      }
    }
  }
}