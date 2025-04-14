// src/app/auth/registro/registro.page.ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegistroPage {
  formularioRegistro = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {}

  async registrar() {
    if (this.formularioRegistro.valid) {
      try {
        const datosRegistro = {
          nombre: this.formularioRegistro.value.nombre!,
          apellido: this.formularioRegistro.value.apellido!,
          correo: this.formularioRegistro.value.correo!,
          telefono: this.formularioRegistro.value.telefono!,
          contrasena: this.formularioRegistro.value.contrasena!
        };
        
        await this.authService.registrarUsuario(datosRegistro);
      } catch (error) {
        console.log(error)
      }
    } else {
      await this.authService.mostrarToast('Por favor completa todos los campos correctamente', 'danger');
    }
  }
}