export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  rut: string;
  birthDate: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  rut: string;
  birthDate: string;
  email: string;
  phone: string;
}

export type UpdatePatientDto = CreatePatientDto;

export type PatchPatientDto = Partial<CreatePatientDto>;

// Representa exactamente los campos editables del formulario
export type FormData = CreatePatientDto;

// Mapa de errores opcionales por cada campo del formulario
export type FormErrors = Partial<Record<keyof FormData, string>>;