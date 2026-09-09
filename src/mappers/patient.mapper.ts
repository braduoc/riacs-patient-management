import type {
  CreatePatientDto,
  PatchPatientDto,
  Patient,
  UpdatePatientDto,
} from "../types/patient";
import { PhoneValidatorHelper } from "../utils/phoneValidator";
import { RutValidatorHelper } from "../utils/rutValidator";

export interface BackendPatient {
  id: number;
  firstName: string;
  lastName: string;
  rut: string;
  birthDate: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface BackendPagedResponse {
  items: BackendPatient[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}

export const mapFromBackend = (data: BackendPatient): Patient => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  rut: data.rut,
  birthDate: data.birthDate,
  email: data.email,
  phone: data.phoneNumber || "",
  createdAt: data.createdAt,
});

export const mapToBackend = (data: CreatePatientDto | UpdatePatientDto) => ({
  firstName: data.firstName.trim(),
  lastName: data.lastName.trim(),
  rut: RutValidatorHelper.format(data.rut),
  birthDate: data.birthDate,
  email: data.email.trim().toLowerCase(),
  phoneNumber: data.phone && data.phone.trim()
    ? PhoneValidatorHelper.format(data.phone)
    : "",
});

export const mapPatchToBackend = (data: PatchPatientDto): Record<string, string> => {
  const payload: Record<string, string> = {};
  if (data.firstName !== undefined) payload.firstName = data.firstName.trim();
  if (data.lastName !== undefined) payload.lastName = data.lastName.trim();
  if (data.rut !== undefined) payload.rut = RutValidatorHelper.format(data.rut);
  if (data.birthDate !== undefined) payload.birthDate = data.birthDate;
  if (data.email !== undefined) payload.email = data.email.trim().toLowerCase();
  if (data.phone !== undefined) {
    payload.phoneNumber = data.phone.trim()
      ? PhoneValidatorHelper.format(data.phone)
      : "";
  }
  return payload;
};