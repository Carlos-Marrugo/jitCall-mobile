// src/app/auth/registro/registro.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConexionService } from '../../core/services/conexion.service';
import { Network } from '@capacitor/network';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RegistroPage {
  formularioRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async registrar() {
    const status = await Network.getStatus();
    if (!status.connected) {
      console.log("Verifica tu internet pobre")
      return;
    }
    if (this.formularioRegistro.valid) {
      try {
        await this.authService.registrarUsuario(this.formularioRegistro.value);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error en registro:', error);
      }
    }
  }
}