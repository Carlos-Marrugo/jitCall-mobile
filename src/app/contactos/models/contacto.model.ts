export interface Contacto {
    id?: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
    fechaCreacion?: string;
    userId?: string; // Añade esta propiedad
  }