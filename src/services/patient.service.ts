import type { FormData, FormErrors, Patient } from "../types/patient";

export const SEED: Patient[] = [
  { id: 1, nombre: "Valentina",  apellido: "Morales Soto",    rut: "12.345.678-K", fechaNacimiento: "1988-03-14", email: "vmorales@mail.cl",    telefono: "+56 9 8123 4567" },
  { id: 2, nombre: "Rodrigo",    apellido: "Fuentes Vera",    rut: "15.678.901-2", fechaNacimiento: "1974-07-22", email: "rfuentes@mail.cl",    telefono: "+56 9 7234 5678" },
  { id: 3, nombre: "Camila",     apellido: "Araya López",     rut: "18.234.567-9", fechaNacimiento: "1995-11-05", email: "caraya@correo.cl",    telefono: "+56 9 6345 6789" },
  { id: 4, nombre: "Tomás",      apellido: "Herrera Castro",  rut: "11.098.765-3", fechaNacimiento: "1967-01-30", email: "therrera@mail.cl",    telefono: "+56 9 5456 7890" },
  { id: 5, nombre: "Isidora",    apellido: "Navarro Bravo",   rut: "20.123.456-7", fechaNacimiento: "2000-09-18", email: "inavarro@correo.cl",  telefono: "+56 9 4567 8901" },
  { id: 6, nombre: "Felipe",     apellido: "Salinas Pinto",   rut: "14.567.890-1", fechaNacimiento: "1981-06-12", email: "fsalinas@mail.cl",    telefono: "+56 9 3678 9012" },
  { id: 7, nombre: "Antonia",    apellido: "Contreras Ríos",  rut: "16.890.123-5", fechaNacimiento: "1993-02-28", email: "acontreras@mail.cl",  telefono: "+56 9 2789 0123" },
  { id: 8, nombre: "Matías",     apellido: "Espinoza Rojas",  rut: "13.456.789-0", fechaNacimiento: "1978-12-03", email: "mespinoza@correo.cl", telefono: "+56 9 1890 1234" },
];

export const EMPTY: FormData = {
  nombre: "",
  apellido: "",
  rut: "",
  fechaNacimiento: "",
  email: "",
  telefono: "",
};

export function validate(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (!f.nombre.trim())        e.nombre = "El nombre es requerido.";
  else if (f.nombre.trim().length < 2) e.nombre = "Mínimo 2 caracteres.";

  if (!f.apellido.trim())      e.apellido = "El apellido es requerido.";
  else if (f.apellido.trim().length < 2) e.apellido = "Mínimo 2 caracteres.";

  if (!f.rut.trim())           e.rut = "El RUT es requerido.";
  else if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(f.rut.trim())) e.rut = "Formato: 12.345.678-K";

  if (!f.fechaNacimiento)      e.fechaNacimiento = "La fecha es requerida.";
  else {
    const dob = new Date(f.fechaNacimiento);
    if (dob > new Date())      e.fechaNacimiento = "No puede ser fecha futura.";
    else if (new Date().getFullYear() - dob.getFullYear() > 120) e.fechaNacimiento = "Fecha inválida.";
  }

  if (!f.email.trim())         e.email = "El correo es requerido.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Correo inválido.";

  if (!f.telefono.trim())      e.telefono = "El teléfono es requerido.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(f.telefono.trim())) e.telefono = "Teléfono inválido.";

  return e;
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function calcAge(iso: string) {
  const today = new Date();
  const dob   = new Date(iso);
  let age = today.getFullYear() - dob.getFullYear();
  const diff  = today.getMonth() - dob.getMonth();
  if (diff < 0 || (diff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function initials(p: Patient) {
  return `${p.nombre[0] ?? ""}${p.apellido[0] ?? ""}`.toUpperCase();
}
