export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
}

export type FormData = Omit<Patient, "id">;
export type FormErrors = Partial<Record<keyof FormData, string>>;
